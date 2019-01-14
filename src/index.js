/* @flow */

import 'ignore-styles';
import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import fs from 'fs-extra';
import path from 'path';
import inside from 'path-is-inside';
import sane from 'sane';
import chalk from 'chalk';
import opn from 'opn';
import buildEntry from './buildEntry';
import buildHTML from './buildHTML';
import md from './parsers/md';
import mdx from './parsers/mdx';
import component from './parsers/component';
import custom from './parsers/custom';
import configureWebpack from './configureWebpack';
import type { Options, Page, Separator, Metadata, PageInfo } from './types';

const buildPageInfo = (data: Array<Metadata | Separator>): PageInfo[] =>
  (data.filter(it => it.type !== 'separator'): any);

const collectData = (page: Page, options: { root: string }): Metadata => {
  switch (page.type) {
    case 'md':
      return md(page.file, options);
    case 'mdx':
      return mdx(page.file, options);
    case 'component':
      return component(page.file, options);
    case 'custom':
      return custom(page.file, options);
    default:
      throw new Error(`Invalid type ${String(page.type)} for ${page.file}`);
  }
};

const stringifyData = data => `module.exports = [
  ${data
    /* $FlowFixMe */
    .map(item => (item.stringify ? item.stringify() : JSON.stringify(item)))
    .join(',')}
]`;

export function build({
  root = process.cwd(),
  assets,
  scripts,
  styles,
  pages: getPages,
  github,
  output,
}: Options) {
  const pages = typeof getPages === 'function' ? getPages() : getPages;
  const data = pages.map(page =>
    page.type === 'separator' ? page : collectData(page, { root })
  );

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  if (assets) {
    assets.forEach(dir => {
      fs.copySync(dir, path.join(output, path.basename(dir)));
    });
  }

  if (scripts) {
    scripts.forEach(name => {
      fs.copySync(name, path.join(output, 'scripts', path.basename(name)));
    });
  }

  fs.writeFileSync(
    path.join(output, 'app.src.js'),
    buildEntry({ styles, github })
  );

  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  buildPageInfo(data).forEach(info => {
    fs.writeFileSync(
      path.join(output, `${info.link}.html`),
      buildHTML({
        data,
        info,
        github,
        sheets: ['app.css'],
        scripts: scripts ? scripts.map(s => `scripts/${path.basename(s)}`) : [],
      })
    );
  });

  const config = configureWebpack({
    root,
    entry: path.join(output, 'app.src.js'),
    output: {
      path: output,
      bundle: 'app.bundle.js',
      style: 'app.css',
    },
    production: true,
  });
  webpack(config).run((err, stats) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        stats.toString({
          chunks: false,
          colors: true,
        })
      );
    }
  });
}

export function serve({
  root = process.cwd(),
  assets,
  scripts,
  styles,
  pages: getPages,
  github,
  output,
  port = 3031,
  open = true,
}: Options) {
  const cache: Map<string, Metadata> = new Map();
  const collectAndCache = (page: Page | Separator) => {
    if (page.type === 'separator') {
      return page;
    }

    let result = cache.get(page.file);

    if (result) {
      return result;
    }

    result = collectData(page, { root });
    cache.set(page.file, result);

    return result;
  };

  let pages = typeof getPages === 'function' ? getPages() : getPages;
  let data = pages.map(collectAndCache);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(
    path.join(output, 'app.src.js'),
    buildEntry({ styles, github })
  );

  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  let routes = buildPageInfo(data).reduce((acc, info) => {
    acc[info.link] = buildHTML({
      data,
      info,
      github,
      sheets: ['app.css'],
      scripts: scripts ? scripts.map(s => `scripts/${path.basename(s)}`) : [],
    });
    return acc;
  }, {});

  const callback = (event: 'change' | 'add' | 'delete') => (
    relative: string,
    base: string
  ) => {
    const file = path.join(base, relative);

    // Ignore files under the output directory
    if (inside(file, output)) {
      return;
    }

    if (
      event === 'change' &&
      !pages.some(page => {
        // Check if the changed file was a page
        if (page.type !== 'separator' && page.file === file) {
          return true;
        }

        // Check if the changed file was a dependency
        return data.some(item =>
          item.type !== 'separator' ? item.dependencies.includes(file) : false
        );
      })
    ) {
      // Ignore if the changed file is not in the dependency tree
      return;
    }

    // When a file changes, invalidate it's cache and all files dependent on it
    cache.delete(file);
    cache.forEach((page, key) => {
      if (page.dependencies.includes(file)) {
        cache.delete(key);
      }
    });

    try {
      pages = typeof getPages === 'function' ? getPages() : getPages;
      data = pages.map(collectAndCache);

      const filepath = path.join(output, 'app.data.js');
      const content = stringifyData(data);

      if (content !== fs.readFileSync(filepath, 'utf-8')) {
        fs.writeFileSync(filepath, content);
      }

      routes = buildPageInfo(data).reduce((acc, info) => {
        acc[info.link] = buildHTML({
          data,
          info,
          github,
          sheets: ['app.css'],
          scripts: scripts
            ? scripts.map(s => `scripts/${path.basename(s)}`)
            : [],
        });
        return acc;
      }, {});
    } catch (e) {
      console.log(chalk.red(`Error building files: ${e.toString()}`));
    }
  };

  const watcher = sane(root, {
    watchman: true,
    glob: ['**/*.md', '**/*.mdx', '**/*.js'],
    ignored: /node_modules/,
  });

  watcher.on('change', callback('change'));
  watcher.on('add', callback('add'));
  watcher.on('delete', callback('delete'));

  const cleanup = () => {
    watcher.close();
    process.exit();
  };

  process.stdin.resume();
  process.on('SIGINT', cleanup);
  process.on('SIGUSR1', cleanup);
  process.on('SIGUSR2', cleanup);
  process.on('uncaughtException', cleanup);

  const app = express();

  if (assets) {
    assets.forEach(dir => {
      app.get(`/${path.basename(dir)}/*`, (req, res) => {
        res.sendFile(path.join(path.dirname(dir), req.path));
      });
    });
  }

  if (scripts) {
    scripts.forEach(name => {
      app.get(`/scripts/${path.basename(name)}`, (req, res) => {
        res.sendFile(name);
      });
    });
  }

  app.get('*', (req, res, next) => {
    const page = req.path.slice(1).replace(/\.html$/, '');

    if (page === '' && routes.index) {
      res.send(routes.index);
    } else if (routes[page]) {
      res.send(routes[page]);
    } else {
      next();
    }
  });

  const config = configureWebpack({
    root,
    entry: path.join(output, 'app.src.js'),
    output: {
      path: output,
      bundle: 'app.bundle.js',
      style: 'app.css',
    },
    production: false,
  });
  const compiler = webpack(config);

  app.use(
    devMiddleware(compiler, {
      loglevel: 'warn',
      publicPath: config.output.publicPath,
      stats: 'errors-only',
    })
  );
  app.use(hotMiddleware(compiler));
  app.listen(port);

  const url = `http://localhost:${port}`;

  if (open) {
    console.log(`Opening ${chalk.blue(url)} in your browser…\n`);

    opn(url);
  } else {
    console.log(`Open ${chalk.blue(url)} in your browser.\n`);
  }
}

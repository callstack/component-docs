/* @flow */

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
import buildEntry from './utils/buildEntry';
import buildHTML from './utils/buildHTML';
import build404 from './utils/build404';
import buildPageInfo from './utils/buildPageInfo';
import configureWebpack from './utils/configureWebpack';
import collectData from './utils/collectData';
import stringifyData from './utils/stringifyData';
import getOptions from './utils/getOptions';
import type { Options, Page, Separator, Metadata } from './types';

export default function serve(o: Options) {
  const options = getOptions(o);
  const {
    root,
    assets,
    scripts,
    styles,
    pages: getPages,
    github,
    logo,
    output,
    port,
    open,
    colors,
  } = options;

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
    buildEntry({ styles, github, logo })
  );

  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  let fallback = build404({ data, sheets: ['app.css'] });
  let routes = buildPageInfo(data).reduce((acc, info) => {
    acc[info.link] = buildHTML({
      data,
      info,
      github,
      logo,
      sheets: ['app.css'],
      scripts: scripts ? scripts.map(s => `scripts/${path.basename(s)}`) : [],
      colors,
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

      fallback = build404({ data, sheets: ['app.css'] });
      routes = buildPageInfo(data).reduce((acc, info) => {
        acc[info.link] = buildHTML({
          data,
          info,
          github,
          logo,
          sheets: ['app.css'],
          scripts: scripts
            ? scripts.map(s => `scripts/${path.basename(s)}`)
            : [],
          colors,
        });
        return acc;
      }, {});
    } catch (e) {
      console.log(chalk.red(`Error building files: ${e.toString()}`));
    }
  };

  const watcher = sane(root, {
    watchman: true,
    glob: ['**/*.md', '**/*.mdx', '**/*.js', '**/*.ts', '**/*.tsx'],
    ignored: /node_modules/,
  });

  watcher.on('change', callback('change'));
  watcher.on('add', callback('add'));
  watcher.on('delete', callback('delete'));

  const cleanup = () => {
    watcher.close();
    process.exit();
  };

  const error = e => {
    console.log(e.stack || e.message);
    process.exitCode = 1;
    cleanup();
  };

  process.stdin.resume();
  process.on('SIGINT', cleanup);
  process.on('SIGUSR1', cleanup);
  process.on('SIGUSR2', cleanup);
  process.on('uncaughtException', error);
  process.on('unhandledRejection', error);

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

  app.get('*', (req, res) => {
    const page = req.path.slice(1).replace(/\.html$/, '');

    if (page === '' && routes.index) {
      res.send(routes.index);
    } else if (routes[page]) {
      res.send(routes[page]);
    } else {
      res.send(fallback);
    }
  });

  app.listen(port, () => {
    const url = `http://localhost:${port}`;

    if (open) {
      console.log(`Opening ${chalk.blue(url)} in your browser…\n`);

      opn(url);
    } else {
      console.log(`Open ${chalk.blue(url)} in your browser.\n`);
    }
  });
}

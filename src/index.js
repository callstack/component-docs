/* @flow */

import 'ignore-styles';
import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import fs from 'fs-extra';
import path from 'path';
import watch from 'node-watch';
import chalk from 'chalk';
import opn from 'opn';
import buildEntry from './buildEntry';
import buildHTML from './buildHTML';
import markdown from './parsers/markdown';
import component from './parsers/component';
import custom from './parsers/custom';
import configureWebpack from './configureWebpack';
import type { Options, Page, Separator, Metadata, PageInfo } from './types';

const buildPageInfo = (data: Array<Metadata | Separator>): PageInfo[] =>
  (data.filter(it => it.type !== 'separator'): any);

const collectData = (pages: Array<Page | Separator>) =>
  pages.map(page => {
    if (page.type === 'separator') {
      return page;
    }

    switch (page.type) {
      case 'markdown':
        return markdown(page.file);
      case 'component':
        return component(page.file);
      case 'custom':
        return custom(page.file);
      default:
        throw new Error(`Invalid type ${String(page.type)} for ${page.file}`);
    }
  });

const stringifyData = data => `module.exports = [
  ${data
    /* $FlowFixMe */
    .map(item => (item.stringify ? item.stringify() : JSON.stringify(item)))
    .join(',')}
]`;

export function build({
  assets,
  scripts,
  styles,
  pages: getPages,
  github,
  output,
  layout = require.resolve('./templates/Layout'),
}: Options) {
  const pages = typeof getPages === 'function' ? getPages() : getPages;
  const data = collectData(pages);

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
    buildEntry({ layout, styles, github })
  );

  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  buildPageInfo(data).forEach(info => {
    fs.writeFileSync(
      path.join(output, `${info.link}.html`),
      buildHTML({
        layout,
        data,
        info,
        github,
        sheets: ['app.css'],
        scripts: scripts ? scripts.map(s => `scripts/${path.basename(s)}`) : [],
      })
    );
  });

  const config = configureWebpack({
    root: process.cwd(),
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
  assets,
  scripts,
  styles,
  pages: getPages,
  github,
  output,
  port = 3031,
  layout = require.resolve('./templates/Layout'),
  open = true,
}: Options) {
  let pages = typeof getPages === 'function' ? getPages() : getPages;
  let data = collectData(pages);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(
    path.join(output, 'app.src.js'),
    buildEntry({ layout, styles, github })
  );

  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  let routes = buildPageInfo(data).reduce((acc, info) => {
    acc[info.link] = buildHTML({
      layout,
      data,
      info,
      github,
      sheets: ['app.css'],
      scripts: scripts ? scripts.map(s => `scripts/${path.basename(s)}`) : [],
    });
    return acc;
  }, {});

  watch(
    [process.cwd()],
    { filter: f => !/node_modules/.test(f), delay: 100 },
    (event, file) => {
      if (!path.relative(path.dirname(file), output)) {
        return;
      }

      try {
        pages = typeof getPages === 'function' ? getPages() : getPages;
        data = collectData(pages);

        fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

        routes = buildPageInfo(data).reduce((acc, info) => {
          acc[info.link] = buildHTML({
            layout,
            data,
            info,
            scripts: scripts
              ? scripts.map(s => `scripts/${path.basename(s)}`)
              : [],
          });
          return acc;
        }, {});
      } catch (e) {
        console.log(chalk.red(`Error building files: ${e.toString()}`));
      }
    }
  );

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
    root: process.cwd(),
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

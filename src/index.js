/* @flow */

import 'ignore-styles';
import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import path from 'path';
import watch from 'node-watch';
import buildEntry from './buildEntry';
import buildHTML from './buildHTML';
import markdown from './parsers/markdown';
import component from './parsers/component';
import custom from './parsers/custom';
import configureWebpack from './configureWebpack';
import type { Options, Page, Separator, Metadata, PageInfo } from './types';

const getPageList = (pages: Array<Page | Separator>): Page[] =>
  (pages.filter(it => it.type !== 'separator'): any);

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
  pages: getPages,
  output,
  layout = require.resolve('./templates/Layout'),
}: Options) {
  const pages = typeof getPages === 'function' ? getPages() : getPages;
  const data = collectData(pages);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(path.join(output, 'app.src.js'), buildEntry({ layout }));
  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  buildEntry({ layout });
  buildPageInfo(data).forEach(info => {
    fs.writeFileSync(
      path.join(output, `${info.name}.html`),
      buildHTML({ layout, data, info, sheet: 'app.css' })
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
    if (err || stats.hasErrors()) {
      console.log(err, stats);
    } else {
      console.log(stats);
    }
  });
}

export function serve({
  pages: getPages,
  output,
  port = 3031,
  layout = require.resolve('./templates/Layout'),
}: Options) {
  let pages = typeof getPages === 'function' ? getPages() : getPages;
  let data = collectData(pages);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(path.join(output, 'app.src.js'), buildEntry({ layout }));
  fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

  let routes = buildPageInfo(data).reduce((acc, info) => {
    acc[info.name] = buildHTML({ layout, data, info });
    return acc;
  }, {});

  const dirs = [];

  getPageList(pages).forEach(page => {
    const dir = path.dirname(page.file);
    if (!dirs.includes(dir)) {
      dirs.push(dir);
    }
  });

  watch(dirs, (event, file) => {
    if (!path.relative(path.dirname(file), output)) {
      return;
    }

    pages = typeof getPages === 'function' ? getPages() : getPages;
    data = collectData(pages);

    fs.writeFileSync(path.join(output, 'app.data.js'), stringifyData(data));

    routes = buildPageInfo(data).reduce((acc, info) => {
      acc[info.name] = buildHTML({ layout, data, info });
      return acc;
    }, {});
  });

  const app = express();

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
      noInfo: true,
      publicPath: config.output.publicPath,
      stats: {
        colors: true,
      },
    })
  );
  app.use(hotMiddleware(compiler));
  app.listen(port);

  console.log(`Open http://localhost:${port} in your browser.\n`);
}

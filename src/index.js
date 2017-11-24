/* @flow */

import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import path from 'path';
import watch from 'node-watch';
import { buildRoutes } from './templates/App';
import buildEntry from './buildEntry';
import buildHTML from './buildHTML';
import markdown from './parsers/markdown';
import component from './parsers/component';
import configureWebpack from './configureWebpack';

type Files = Array<string | Array<string>>;

type Options = {
  files: Files | (() => Files),
  output: string,
  port?: number,
  layout?: string,
};

const collectData = files => {
  const data = files
    .reduce((acc, file) => {
      if (Array.isArray(file)) {
        return [...acc, file];
      }
      return [...acc, [file]];
    }, [])
    .map(items =>
      items.map(it => {
        if (it.endsWith('.md')) {
          return markdown(it);
        }
        if (it.endsWith('.js')) {
          return component(it);
        }
        throw new Error('Unknown extension ', it);
      })
    );

  return data;
};

export function build({
  files: getFiles,
  output,
  layout = require.resolve('./templates/Layout'),
}: Options) {
  const files = typeof getFiles === 'function' ? getFiles() : getFiles;
  const data = collectData(files, output);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(path.join(output, 'app.src.js'), buildEntry({ layout }));
  fs.writeFileSync(path.join(output, 'app.data.json'), JSON.stringify(data));

  buildEntry({ layout });
  buildRoutes(data).forEach(route => {
    fs.writeFileSync(
      path.join(output, `${route.name}.html`),
      buildHTML({ layout, data, route, sheet: 'app.css' })
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
  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(err, stats);
    }
  });
}

export function serve({
  files: getFiles,
  output,
  port = 3031,
  layout = require.resolve('./templates/Layout'),
}: Options) {
  let files = typeof getFiles === 'function' ? getFiles() : getFiles;
  let data = collectData(files, output);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  fs.writeFileSync(path.join(output, 'app.src.js'), buildEntry({ layout }));
  fs.writeFileSync(path.join(output, 'app.data.json'), JSON.stringify(data));

  let routes = buildRoutes(data).reduce((acc, route) => {
    acc[route.name] = buildHTML({ layout, data, route });
    return acc;
  }, {});

  const dirs = [];

  files
    .reduce((acc, file) => {
      if (Array.isArray(file)) {
        return [...acc, ...file];
      }
      return [...acc, file];
    }, [])
    .forEach(file => {
      const dir = path.dirname(file);
      if (!dirs.includes(dir)) {
        dirs.push(dir);
      }
    });

  watch(dirs, (event, file) => {
    if (!path.relative(path.dirname(file), output)) {
      return;
    }

    files = typeof getFiles === 'function' ? getFiles() : getFiles;
    data = collectData(files, output);

    fs.writeFileSync(path.join(output, 'app.data.json'), JSON.stringify(data));

    routes = buildRoutes(data).reduce((acc, route) => {
      acc[route.name] = buildHTML({ layout, data, route });
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

/* @flow */

import fs from 'fs';
import path from 'path';
import watch from 'node-watch';
import { server, bundle } from 'quik';
import { buildRoutes } from './templates/App';
import buildEntry from './buildEntry';
import buildHTML from './buildHTML';
import markdown from './parsers/markdown';
import component from './parsers/component';

type Files = Array<string | Array<string>>;

type Options = {
  files: Files | (() => Files),
  output: string,
  port?: number,
  layout?: string,
};

const collectData = (files, output) => {
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

  fs.writeFileSync(path.join(output, 'app.data.json'), JSON.stringify(data));

  return data;
};

export function build({
  files: getFiles,
  output,
  layout = require.resolve('./templates/Layout'),
}: Options) {
  const entry = path.join(output, 'app.src.js');
  const files = typeof getFiles === 'function' ? getFiles() : getFiles;
  const data = collectData(files, output);
  buildEntry({ entry, layout });
  buildRoutes(data).forEach(route =>
    buildHTML({ layout, data, route, output, transpile: true })
  );
  bundle({
    root: process.cwd(),
    entry: [path.relative(process.cwd(), entry)],
    output: path.relative(process.cwd(), path.join(output, 'app.bundle.js')),
    sourcemaps: true,
    production: true,
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
  const entry = path.join(output, 'app.src.js');
  buildEntry({ entry, layout });
  buildRoutes(data).forEach(route =>
    buildHTML({ layout, data, route, output, transpile: false })
  );

  const dirs = [];

  files.forEach(items =>
    items.forEach(file => {
      const dir = path.dirname(file);
      if (!dirs.includes(dir)) {
        dirs.push(dir);
      }
    })
  );

  watch(dirs, (event, file) => {
    if (!path.relative(path.dirname(file), output)) {
      return;
    }
    files = typeof getFiles === 'function' ? getFiles() : getFiles;
    data = collectData(files, output);
    buildRoutes(data).forEach(route =>
      buildHTML({ layout, data, route, output, transpile: false })
    );
  });

  server({
    root: process.cwd(),
    watch: [path.relative(process.cwd(), entry)],
  }).listen(port);

  console.log(
    `Open http://localhost:${port}/${path.relative(
      process.cwd(),
      output
    )}/ in your browser.\n`
  );
}

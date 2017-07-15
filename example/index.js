/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from '../src';

const task = process.argv[2];
const dist = path.join(__dirname, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

const fixtures = path.join(__dirname, '__fixtures__');

function getFiles() {
  return fs
    .readdirSync(fixtures)
    .filter(f => /\.(js|md)/.test(f))
    .map(f => path.join(fixtures, f));
}

if (task !== 'build') {
  serve({
    files: getFiles,
    output: path.join(__dirname, 'dist'),
  });
} else {
  build({
    files: getFiles,
    output: path.join(__dirname, 'dist'),
  });
}

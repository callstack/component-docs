/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from '../src';

const task = process.argv[2];
const output = path.join(__dirname, 'dist');
const fixtures = path.join(__dirname, '__fixtures__');

function files() {
  return fs
    .readdirSync(fixtures)
    .filter(f => /\.(js|md)/.test(f))
    .map(f => path.join(fixtures, f));
}

if (task !== 'build') {
  serve({
    files,
    output,
  });
} else {
  build({
    files,
    output,
  });
}

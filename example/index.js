/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from '../src';

const task = process.argv[2];
const output = path.join(__dirname, 'dist');
const fixtures = path.join(__dirname, '__fixtures__');

function files() {
  const list = fs.readdirSync(fixtures);
  const md = list.filter(f => f.endsWith('.md'));
  const js = list.filter(f => f.endsWith('.js'));

  return [md, js].map(items => items.map(f => path.join(fixtures, f)));
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

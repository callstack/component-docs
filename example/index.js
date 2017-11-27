/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from '../src';

const task = process.argv[2];
const output = path.join(__dirname, 'dist');
const fixtures = path.join(__dirname, '__fixtures__');

function pages() {
  const list = fs.readdirSync(fixtures).map(f => path.join(fixtures, f));
  const md = list
    .filter(f => f.endsWith('.md'))
    .map(file => ({ type: 'markdown', file }));
  const js = list
    .filter(f => f.endsWith('.js'))
    .map(file => ({ type: 'component', file }));

  return [...md, { type: 'separator' }, ...js];
}

if (task !== 'build') {
  serve({
    pages,
    output,
  });
} else {
  build({
    pages,
    output,
  });
}

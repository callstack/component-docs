/* @flow */

import path from 'path';
import fs from 'fs';
import { build, serve } from '../src';

const task = process.argv[2];
const output = path.join(__dirname, 'dist');
const fixtures = path.join(__dirname, '__fixtures__');
const github = 'https://github.com/callstack/component-docs/edit/master';

function pages() {
  const markdown = path.join(fixtures, 'markdown');
  const component = path.join(fixtures, 'component');
  const custom = path.join(fixtures, 'custom');

  return [
    ...fs
      .readdirSync(markdown)
      .map(f => path.join(markdown, f))
      .map(file => ({ type: file.endsWith('mdx') ? 'mdx' : 'md', file })),
    { type: 'separator' },
    ...fs
      .readdirSync(component)
      .map(f => path.join(component, f))
      .map(file => ({ type: 'component', file })),
    { type: 'separator' },
    ...fs
      .readdirSync(custom)
      .map(f => path.join(custom, f))
      .map(file => ({ type: 'custom', file })),
  ];
}

if (task !== 'build') {
  serve({
    assets: [path.join(fixtures, 'assets', 'screenshots')],
    styles: [path.join(fixtures, 'assets', 'styles.css')],
    pages,
    output,
    github,
  });
} else {
  build({
    assets: [path.join(fixtures, 'assets', 'screenshots')],
    styles: [path.join(fixtures, 'assets', 'styles.css')],
    pages,
    output,
    github,
  });
}

/* @flow */

import path from 'path';
import fs from 'fs';

const output = path.join(__dirname, 'dist');
const fixtures = path.join(__dirname, '__fixtures__');
const assets = path.join(fixtures, 'assets');
const github = 'https://github.com/callstack/component-docs/edit/master';

function pages() {
  const markdown = path.join(fixtures, 'markdown');
  const component = path.join(fixtures, 'component');
  const custom = path.join(fixtures, 'custom');

  return [
    ...fs
      .readdirSync(markdown)
      .map((f) => path.join(markdown, f))
      .map((file) => ({ type: file.endsWith('mdx') ? 'mdx' : 'md', file })),
    { type: 'separator' },
    ...fs
      .readdirSync(component)
      .map((f) => path.join(component, f))
      .map((file) => ({ type: 'component', file })),
    { type: 'separator' },
    ...fs
      .readdirSync(custom)
      .map((f) => path.join(custom, f))
      .map((file) => ({ type: 'custom', file })),
  ];
}

module.exports = {
  logo: 'images/logo.svg',
  favicon: 'images/logo.ico',
  assets: [path.join(assets, 'screenshots'), path.join(assets, 'images')],
  styles: [path.join(assets, 'styles.css')],
  pages,
  output,
  github,
  title: '[title] - Component Docs',
};

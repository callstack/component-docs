/* @flow */

import fs from 'fs';
import { parse } from 'react-docgen';
import dashify from 'dashify';
import type { Metadata } from '../types';

export default function(file: string): Metadata {
  const name = file
    .split('/')
    .pop()
    .replace(/\.jsx?$/, '');
  const info = parse(fs.readFileSync(file).toString());

  return {
    title: name,
    name: dashify(name),
    description: info.description,
    data: info,
    type: 'component',
  };
}

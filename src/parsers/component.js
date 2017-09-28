/* @flow */

import fs from 'fs';
import { parse } from 'react-docgen';
import type { Metadata } from '../types/Metadata';

export default function(file: string): Metadata {
  const name = file
    .split('/')
    .pop()
    .replace(/\.jsx?$/, '');
  const info = parse(fs.readFileSync(file).toString());

  return {
    title: name,
    name: name.toLowerCase().replace(/\s+/, '-'),
    description: info.description,
    data: info,
    type: 'component',
  };
}

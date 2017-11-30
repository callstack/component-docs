/* @flow */

import fs from 'fs';
import { parse } from 'react-docgen';
import dashify from 'dashify';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

export default function(file: string): Metadata {
  const info = parse(fs.readFileSync(file).toString());
  const name = info.displayName || getNameFromPath(file);

  return {
    title: name,
    description: info.description,
    path: dashify(name),
    data: info,
    type: 'component',
  };
}

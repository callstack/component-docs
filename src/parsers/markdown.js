/* @flow */

import fs from 'fs';
import path from 'path';
import dashify from 'dashify';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

export default function(
  filepath: string,
  { root }: { root: string }
): Metadata {
  let text = fs.readFileSync(filepath, 'utf-8');
  let slugs = [];

  const lines = text.split('\n');

  if (/^-+$/.test(lines[0])) {
    for (let i = 1, l = lines.length; i < l; i++) {
      const line = lines[i];
      if (/.+:.+/.test(line)) {
        slugs.push(line);
      } else {
        if (/^-+$/.test(line.trim())) {
          text = lines.slice(i + 1).join('\n');
        } else {
          slugs = [];
        }
        break;
      }
    }
  }

  const meta = slugs.reduce((acc, line) => {
    const parts = line.split(':');
    return { ...acc, [parts[0].trim()]: parts[1].trim() };
  }, {});

  text = text
    .split('\n')
    .map(line => {
      if (/^\/.+\.md$/.test(line)) {
        try {
          return fs
            .readFileSync(path.join(path.dirname(filepath), line))
            .toString();
        } catch (e) {
          // do nothing
        }
      }
      return line;
    })
    .join('\n');

  const name = getNameFromPath(filepath);

  return {
    filepath: path.relative(root, filepath),
    title: meta.title || name,
    description: meta.description || '',
    link: meta.link || dashify(name),
    data: text,
    type: 'markdown',
  };
}

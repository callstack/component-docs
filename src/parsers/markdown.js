/* @flow */

import fs from 'fs';
import path from 'path';
import dashify from 'dashify';
import type { Metadata } from '../types';

export default function(file: string): Metadata {
  let text = fs.readFileSync(file).toString();
  let slugs = [];

  const lines = text.split('\n');

  for (let i = 0, l = lines.length; i < l; i++) {
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
            .readFileSync(path.join(path.dirname(file), line))
            .toString();
        } catch (e) {
          // do nothing
        }
      }
      return line;
    })
    .join('\n');

  const name = file
    .split('/')
    .pop()
    .replace(/\.md$/, '')
    .replace(/^\d+\./, '');

  return {
    title: meta.title || name,
    name: meta.permalink || dashify(name),
    description: meta.description,
    data: text,
    type: 'markdown',
  };
}

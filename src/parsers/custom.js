/* @flow */

import path from 'path';
import dedent from 'dedent';
import dashify from 'dashify';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

export default function(file: string): Metadata {
  /* $FlowFixMe */
  const exported = require(file); // eslint-disable-line global-require
  const component = exported.__esModule ? exported.default : exported;
  const name = component.displayName || component.name || getNameFromPath(file);
  const meta = component.meta || {};

  const title = meta.title || name;
  const description = meta.description;
  const link = meta.link || dashify(name);
  const type = 'custom';

  return {
    filepath: path.relative(process.cwd(), file),
    title,
    description,
    type,
    link,
    data: component,
    stringify() {
      return dedent`
        (function() {
          var e = require(${JSON.stringify(file)});
          var c = e.__esModule ? e.default : e;
          var m = c.meta || {};
          return {
             title: m.title || ${JSON.stringify(title)},
             path: m.link || ${JSON.stringify(link)},
             description: m.description,
             type: ${JSON.stringify(type)},
             data: c
          };
        }())`;
    },
  };
}

/* @flow */

import path from 'path';
import dedent from 'dedent';
import dashify from 'dashify';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

export default function custom(
  filepath: string,
  { root }: { root: string }
): Metadata {
  /* $FlowFixMe */
  const exported = require(filepath); // eslint-disable-line global-require
  const component =
    typeof exported.default === 'function' ? exported.default : exported;
  const name =
    component.displayName || component.name || getNameFromPath(filepath);
  const meta = component.meta || {};

  const title = meta.title || name;
  const description = meta.description;
  const link = meta.link || dashify(name);
  const type = 'custom';

  return {
    filepath: path.relative(root, filepath),
    title,
    description,
    type,
    link,
    data: component,
    stringify() {
      return dedent`
        (function() {
          var e = require(${JSON.stringify(filepath)});
          var c = typeof e.default === 'function' ? e.default : e;
          var m = c.meta || {};
          return {
             title: m.title || ${JSON.stringify(title)},
             link: m.link || ${JSON.stringify(link)},
             description: m.description,
             type: ${JSON.stringify(type)},
             data: c
          };
        }())`;
    },
    dependencies: [],
  };
}

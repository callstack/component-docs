/* @flow */

import dashify from 'dashify';
import type { Metadata } from '../types';

export default function(file: string): Metadata {
  /* $FlowFixMe */
  const exported = require(file); // eslint-disable-line global-require
  const component = exported.__esModule ? exported.default : exported;
  const meta = component.meta || {};

  const info = {
    title: meta.title || component.displayName || component.name,
    name: meta.permalink || dashify(component.displayName || component.name),
    description: meta.description,
    type: 'custom',
  };

  /* $FlowFixMe */
  return {
    ...info,
    data: component,
    stringify() {
      return (
        `(function() {` +
        `var e = require('${file}');` +
        `var c = e.__esModule ? e.default : e;` +
        `var m = c.meta || {};` +
        `return { title: m.title, name: m.permalink || ${JSON.stringify(
          info.name
        )}, description: m.description, type: 'custom', data: c }` +
        `}())`
      );
    },
  };
}

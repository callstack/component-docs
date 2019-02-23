/* @flow */

import type { Separator, Metadata } from '../types';

export default function stringifyData(data: Array<Metadata | Separator>) {
  return `module.exports = [
  ${data
    /* $FlowFixMe */
    .map(item => (item.stringify ? item.stringify() : JSON.stringify(item)))
    .join(',')}
]`;
}

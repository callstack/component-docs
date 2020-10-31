/* @flow */

import type { Separator, Metadata, PageInfo } from '../types';

export default function buildPageInfo(
  data: Array<Metadata | Separator>
): PageInfo[] {
  return (data.filter((it) => it.type !== 'separator'): any);
}

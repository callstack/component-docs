/* @flow */

import md from '../parsers/md';
import mdx from '../parsers/mdx';
import component from '../parsers/component';
import custom from '../parsers/custom';
import type { Page, Metadata } from '../types';

export default function (
  page: Page,
  options: { root: string, logo?: string, github?: string }
): Metadata {
  let data: Metadata;

  switch (page.type) {
    case 'md':
      data = md(page.file, options);
      break;
    case 'mdx':
      data = mdx(page.file, options);
      break;
    case 'component':
      data = component(page.file, options);
      break;
    case 'custom':
      data = custom(page.file, options);
      break;
    default:
      throw new Error(`Invalid type ${String(page.type)} for ${page.file}`);
  }

  /* $FlowFixMe */
  return {
    ...data,
    group: page.group !== undefined ? page.group : data.group,
  };
}

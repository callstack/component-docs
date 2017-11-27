/* @flow */

import * as React from 'react';

export type Page =
  | { type: 'markdown', file: string }
  | { type: 'component', file: string };

export type Separator = { type: 'separator' };

export type Options = {
  pages: Array<Page | Separator> | (() => Array<Page | Separator>),
  output: string,
  port?: number,
  layout?: string,
};

export type PageInfo = {
  name: string,
  title: string,
  description: string,
};

export type Metadata =
  | (PageInfo & { type: 'markdown', data: string })
  | (PageInfo & { type: 'component', data: {} });

export type Route = PageInfo & {
  render: (props: mixed) => React.Element<any>,
  props?: {},
};

/* @flow */

import * as React from 'react';

export type Page = { type: 'md' | 'component' | 'custom', file: string };

export type Separator = { type: 'separator' };

export type Options = {
  root?: string,
  assets?: string[],
  styles?: string[],
  scripts?: string[],
  pages: Array<Page | Separator> | (() => Array<Page | Separator>),
  output: string,
  port?: number,
  layout?: string,
  open?: boolean,
  github?: string,
};

export type PageInfo = {
  title: string,
  description: string,
  link: string,
  filepath: string,
  dependencies: string[],
};

export type TypeAnnotation = {
  name?: string,
  raw: string,
};

export type Docs = {
  description: string,
  props: {
    [prop: string]: {
      description: string,
      required?: boolean,
      defaultValue?: {
        value: string | number,
      },
      flowType?: TypeAnnotation,
      type?: TypeAnnotation,
    },
  },
  methods: Array<{
    name: string,
    description?: string,
    docblock?: string,
    params: Array<{
      name: string,
      type?: TypeAnnotation,
    }>,
    returns: ?{
      type?: TypeAnnotation,
    },
    modifiers: Array<'static' | 'generator' | 'async'>,
  }>,
  statics: Array<{
    name: string,
    description?: string,
    type?: TypeAnnotation,
    value?: string,
  }>,
};

export type Metadata =
  | (PageInfo & { type: 'md', data: string })
  | (PageInfo & { type: 'component', data: Docs })
  | (PageInfo & {
      type: 'custom',
      data: React.ComponentType<{}>,
      stringify: () => string,
    });

export type Route = PageInfo & {
  render: (props: mixed) => React.Element<any>,
  props?: {},
};

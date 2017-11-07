/* @flow */

import * as React from 'react';

export type Route = {
  name: string,
  title: string,
  description: string,
  component: (props: any) => React.Element<any>,
  props?: Object,
};

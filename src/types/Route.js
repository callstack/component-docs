/* @flow */

import React from 'react';

export type Route = {
  name: string,
  title: string,
  description: string,
  component: (props: any) => React.Element<*>,
  props?: Object,
};

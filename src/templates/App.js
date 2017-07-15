/* @flow */

import React from 'react';
import Router from './Router';
import Page from './Page';
import ComponentDocs from './ComponentDocs';
import Markdown from './Markdown';
import type { Metadata } from '../types/Metadata';
import type { Route } from '../types/Route';

export const buildRoutes = (data: Array<Array<Metadata>>): Array<Route> => {
  const routes = data.map(items =>
    items.map(it => {
      let component;
      switch (it.type) {
        case 'markdown':
          component = props =>
            <Page {...props} data={data}>
              <Markdown source={it.data} />
            </Page>;
          break;
        case 'component':
          component = props =>
            <Page {...props} data={data}>
              <ComponentDocs name={it.title} info={it.data} />
            </Page>;
          break;
        default:
          throw new Error(`Unknown type ${it.type}`);
      }
      return {
        ...it,
        component,
      };
    })
  );
  return [].concat.apply([], routes);
};

type Props = {
  name: string,
  data: Array<Array<Metadata>>,
};

export default function App({ name, data }: Props) {
  const routes = buildRoutes(data);
  return <Router name={name} routes={[].concat.apply([], routes)} />;
}

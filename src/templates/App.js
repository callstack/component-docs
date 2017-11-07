/* @flow */

import * as React from 'react';
import Router from './Router';
import Documentation from './Documentation';
import Markdown from './Markdown';
import Sidebar from './Sidebar';
import Content from './Content';
import type { Metadata } from '../types/Metadata';
import type { Route } from '../types/Route';

export const buildRoutes = (
  data: Array<Array<Metadata>>,
  layout: React.ComponentType<*>
): Array<Route> => {
  const Layout = layout;
  const routes = data.map(items =>
    items.map(it => {
      let render;
      switch (it.type) {
        case 'markdown':
          render = props => (
            <Layout
              sidebar={<Sidebar {...props} data={data} />}
              content={
                <Content {...props}>
                  <Markdown source={it.data} />
                </Content>
              }
            />
          );
          break;
        case 'component':
          render = props => (
            <Layout
              sidebar={<Sidebar {...props} data={data} />}
              content={
                <Content {...props}>
                  <Documentation name={it.title} info={it.data} />
                </Content>
              }
            />
          );
          break;
        default:
          throw new Error(`Unknown type ${it.type}`);
      }
      return {
        ...it,
        render,
      };
    })
  );

  return [].concat(...routes);
};

type Props = {
  name: string,
  data: Array<Array<Metadata>>,
  layout: React.ComponentType<*>,
};

export default function App({ name, data, layout }: Props) {
  const routes = buildRoutes(data, layout);
  return <Router name={name} routes={routes} />;
}

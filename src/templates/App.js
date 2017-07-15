/* @flow */

import React from 'react';
import Router from './Router';
import Documentation from './Documentation';
import Markdown from './Markdown';
import Sidebar from './Sidebar';
import Content from './Content';
import type { Metadata } from '../types/Metadata';
import type { Route } from '../types/Route';

export const buildRoutes = (
  data: Array<Array<Metadata>>,
  layout: ReactClass<*>
): Array<Route> => {
  const Layout = layout;
  const routes = data.map(items =>
    items.map(it => {
      let component;
      switch (it.type) {
        case 'markdown':
          component = props =>
            <Layout
              Sidebar={() => <Sidebar {...props} data={data} />}
              Content={() =>
                <Content {...props}>
                  <Markdown source={it.data} />
                </Content>}
            />;
          break;
        case 'component':
          component = props =>
            <Layout
              Sidebar={() => <Sidebar {...props} data={data} />}
              Content={() =>
                <Content {...props}>
                  <Documentation name={it.title} info={it.data} />
                </Content>}
            />;
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
  layout: ReactClass<*>,
};

export default function App({ name, data, layout }: Props) {
  const routes = buildRoutes(data, layout);
  return <Router name={name} routes={[].concat.apply([], routes)} />;
}

/* @flow */

import * as React from 'react';
import Router from './Router';
import Documentation from './Documentation';
import Markdown from './Markdown';
import Sidebar from './Sidebar';
import Content from './Content';
import type { Metadata, Route, Separator } from '../types';

type Data = Array<Metadata | Separator>;

const buildRoutes = (
  data: Data,
  layout: React.ComponentType<*>
): Array<Route> => {
  const Layout = layout;

  const items: any[] = data.filter(item => item.type !== 'separator');

  return items.map((item: Metadata) => {
    let render;

    switch (item.type) {
      case 'markdown':
        {
          const source = item.data;
          render = (props: { path: string }) => (
            <Layout {...props} data={data} Sidebar={Sidebar} Content={Content}>
              <Markdown source={source} />
            </Layout>
          );
        }
        break;
      case 'component':
        render = (props: { path: string }) => (
          <Layout {...props} data={data} Sidebar={Sidebar} Content={Content}>
            <Documentation name={item.title} info={item.data} />
          </Layout>
        );
        break;
      case 'custom':
        {
          const CustomComponent = item.data;
          render = (props: { path: string }) => (
            <Layout
              {...props}
              data={data}
              Sidebar={Sidebar}
              Content={CustomComponent}
            />
          );
        }
        break;
      default:
        throw new Error(`Unknown type ${item.type}`);
    }

    /* $FlowFixMe */
    return {
      ...item,
      render,
    };
  });
};

type Props = {
  path: string,
  data: Data,
  layout: React.ComponentType<*>,
};

export default function App({ path, data, layout }: Props) {
  const routes = buildRoutes(data, layout);
  return <Router path={path} routes={routes} />;
}

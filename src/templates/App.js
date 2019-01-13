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
  layout: React.ComponentType<*>,
  github?: string
): Array<Route> => {
  const Layout = layout;

  const items: any[] = data.filter(item => item.type !== 'separator');

  return items.map((item: Metadata) => {
    let render;

    switch (item.type) {
      case 'md':
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
        {
          const info = item.data;
          render = (props: { path: string }) => (
            <Layout {...props} data={data} Sidebar={Sidebar} Content={Content}>
              <Documentation
                name={item.title}
                info={info}
                github={github}
                filepath={item.filepath}
              />
            </Layout>
          );
        }
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

    return {
      ...item,
      /* $FlowFixMe */
      render,
    };
  });
};

type Props = {
  path: string,
  data: Data,
  layout: React.ComponentType<*>,
  github?: string,
};

export default function App({ path, data, layout, github }: Props) {
  const routes = buildRoutes(data, layout, github);
  return <Router path={path} routes={routes} />;
}

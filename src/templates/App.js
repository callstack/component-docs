/* @flow */

import * as React from 'react';
import Router from './Router';
import Documentation from './Documentation';
import Markdown from './Markdown';
import Sidebar from './Sidebar';
import Content from './Content';
import Layout from './Layout';
import type { Metadata, Route, Separator } from '../types';

type Data = Array<Metadata | Separator>;

const buildRoutes = (data: Data, github?: string): Array<Route> => {
  const items: any[] = data.filter(item => item.type !== 'separator');

  return items.map((item: Metadata) => {
    let render;

    switch (item.type) {
      case 'md':
        {
          const source = item.data;
          render = (props: { path: string }) => (
            <Layout>
              <Sidebar path={props.path} data={data} />
              <Content>
                <Markdown source={source} />
              </Content>
            </Layout>
          );
        }
        break;
      case 'component':
        {
          const info = item.data;
          render = (props: { path: string }) => (
            <Layout>
              <Sidebar path={props.path} data={data} />
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
            <Layout>
              <Sidebar path={props.path} data={data} />
              <CustomComponent />
            </Layout>
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
  github?: string,
};

export default function App({ path, data, github }: Props) {
  const routes = buildRoutes(data, github);
  return <Router path={path} routes={routes} />;
}

/* @flow */

import * as React from 'react';
import Router from './Router';
import Documentation from './Documentation';
import Markdown from './Markdown';
import Layout from './Layout';
import Sidebar from './Sidebar';
import Content from './Content';
import type { Metadata, Route, Separator } from '../types';

type Data = Array<Metadata | Separator>;

const buildRoutes = (
  data: Data,
  github?: string,
  logo?: string,
  colors?: {
    primary?: string,
    annotations?: { [key: string]: string },
  }
): Array<Route> => {
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
              <Content logo={logo}>
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
                logo={logo}
                filepath={item.filepath}
                colors={colors}
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
  logo?: string,
  title?: string,
  colors?: {
    primary?: string,
    annotations?: { [key: string]: string },
  },
};

export default function App({
  path,
  data,
  github,
  logo,
  title,
  colors,
}: Props) {
  const routes = buildRoutes(data, github, logo, colors);
  return <Router path={path} routes={routes} title={title} />;
}

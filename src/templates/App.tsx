import * as React from 'react';
import type { Metadata, Route, Separator } from '../types';
import Router from './Router';
import Documentation from './Documentation';
import Markdown from './Markdown';
import Layout from './Layout';
import Sidebar from './Sidebar';
import Content from './Content';

type Data = Array<Metadata | Separator>;

const buildRoutes = (
  data: Data,
  github?: string,
  logo?: string
): Array<Route> => {
  const items = data.filter((item) => item.type !== 'separator') as Metadata[];

  return items.map((item) => {
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
      render,
    };
  });
};

type Props = {
  path: string;
  data: Data;
  github?: string;
  logo?: string;
  title?: string;
};

export default function App({ path, data, github, logo, title }: Props) {
  const routes = buildRoutes(data, github, logo);
  return <Router path={path} routes={routes} title={title} />;
}

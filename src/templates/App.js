/* @flow */

import React from 'react';
import { insertGlobal } from 'glamor';
import Router from './Router';
import Page from './Page';
import ComponentDocs from './ComponentDocs';
import Markdown from './Markdown';
import type { Metadata } from '../types/Metadata';
import type { Route } from '../types/Route';

insertGlobal(`
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  html, body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    margin: 0;
    padding: 0;
    color: #000;
    lineHeight: 1.5;
  }
  code {
    font-family: "Roboto Mono", "Operator Mono", "Fira Code", "Ubuntu Mono", "Droid Sans Mono", "Liberation Mono", "Source Code Pro", Menlo, Consolas, Courier, monospace;
    color: #000;
    line-height: 2;
  }
  a {
    color: #1976D2;
    text-decoration: none;
  }
  a:hover {
    color: #2196F3;
  }
`);

export const buildRoutes = (data: Array<Array<Metadata>>): Array<Route> => {
  const routes = data.map(items =>
    items.map(it => {
      let component;
      switch (it.type) {
      case 'markdown':
        component = props => (
          <Page {...props} data={data}>
            <Markdown source={it.data} />
          </Page>
        );
        break;
      case 'component':
        component = props => (
          <Page {...props} data={data}>
            <ComponentDocs name={it.title} info={it.data} />
          </Page>
        );
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
  name: string;
  data: Array<Array<Metadata>>;
}

export default function App({ name, data }: Props) {
  const routes = buildRoutes(data);
  return (
    <Router
      name={name}
      routes={[].concat.apply([], routes)}
    />
  );
}

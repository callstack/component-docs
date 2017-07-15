/* @flow */

import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { dump } from './lib/styling';
import HTML from './templates/HTML';
import App from './templates/App';
import reset from './styles/reset.css';
import globals from './styles/globals.css';
import type { Route } from './types/Route';
import type { Metadata } from './types/Metadata';

type Options = {
  data: Array<Array<Metadata>>,
  route: Route,
  transpile: boolean,
  output: string,
  layout: string,
};

export default function buildHTML({
  route,
  data,
  transpile,
  output,
  layout,
}: Options) {
  const Layout = require(layout);
  const html = ReactDOMServer.renderToString(
    /* $FlowFixMe */
    <App
      name={route.name}
      data={data}
      layout={Layout.__esModule ? Layout.default : Layout}
    />
  );

  let body = `<div id='root'>${html}</div>`;

  body += `
    <script>
      window.__INITIAL_PATH__ = '${route.name}';
    </script>
  `;

  if (transpile) {
    body += '<script src="./app.bundle.js?transpile=false"></script>';
  } else {
    body += '<script src="./app.src.js"></script>';
  }

  fs.writeFileSync(
    path.join(output, `${route.name}.html`),
    ReactDOMServer.renderToString(
      // eslint-disable-next-line react/jsx-pascal-case
      <HTML
        title={route.title}
        description={route.description || ''}
        body={body}
        css={`
          ${reset}
          ${globals}
          ${dump()}
          `}
      />
    )
  );
}

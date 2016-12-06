/* @flow */

import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { renderStatic } from 'glamor/server';
import HTML from './templates/HTML';
import App from './templates/App';
import type { Route } from './types/Route';
import type { Metadata } from './types/Metadata';

type Options = {
  data: Array<Array<Metadata>>;
  route: Route;
  transpile: boolean;
  output: string;
}

export default function buildHTML({ route, data, transpile, output }: Options) {
  const { html, css, ids } = renderStatic(
    () => ReactDOMServer.renderToString(
      <App
        name={route.name}
        data={data}
      />
    )
  );

  let body = `<div id='root'>${html}</div>`;

  body += `
    <script>
      window.__INITIAL_PATH__ = '${route.name}'
      window.__GLAMOR__ = ${JSON.stringify(ids)}
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
        css={css}
      />
    )
  );
}

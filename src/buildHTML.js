/* @flow */

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import HTML from './templates/HTML';
import App from './templates/App';
import type { Metadata, PageInfo, Separator } from './types';

type Options = {
  data: Array<Metadata | Separator>,
  info: PageInfo,
  layout: string,
  sheets?: string[],
  scripts?: string[],
};

export default function buildHTML({
  info,
  data,
  layout,
  sheets,
  scripts,
}: Options) {
  /* $FlowFixMe */
  const Layout = require(layout); // eslint-disable-line global-require
  const html = ReactDOMServer.renderToString(
    <App
      path={info.path}
      data={data}
      layout={Layout.__esModule ? Layout.default : Layout}
    />
  );

  let body = `<div id='root'>${html}</div>`;

  body += `
    <script>
      window.__INITIAL_PATH__ = '${info.path}';
    </script>
  `;

  body += '<script src="app.bundle.js"></script>';

  if (scripts) {
    scripts.forEach(s => {
      body += `<script src="${s}"></script>`;
    });
  }

  return ReactDOMServer.renderToString(
    // eslint-disable-next-line react/jsx-pascal-case
    <HTML
      title={info.title}
      description={info.description || ''}
      body={body}
      sheets={sheets}
    />
  );
}

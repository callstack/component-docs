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
  sheet?: string,
};

export default function buildHTML({ info, data, layout, sheet }: Options) {
  /* $FlowFixMe */
  const Layout = require(layout); // eslint-disable-line global-require
  const html = ReactDOMServer.renderToString(
    <App
      name={info.name}
      data={data}
      layout={Layout.__esModule ? Layout.default : Layout}
    />
  );

  let body = `<div id='root'>${html}</div>`;

  body += `
    <script>
      window.__INITIAL_PATH__ = '${info.name}';
    </script>
  `;

  body += '<script src="app.bundle.js"></script>';

  return ReactDOMServer.renderToString(
    // eslint-disable-next-line react/jsx-pascal-case
    <HTML
      title={info.title}
      description={info.description || ''}
      body={body}
      sheet={sheet}
    />
  );
}

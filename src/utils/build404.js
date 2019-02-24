/* @flow */

import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import HTML from '../templates/HTML';
import Fallback from '../templates/404';
import buildPageInfo from './buildPageInfo';
import type { Metadata, Separator } from '../types';

type Options = {
  data: Array<Metadata | Separator>,
  sheets: string[],
};

export default function build404({ data, sheets }: Options) {
  const info = buildPageInfo(data);
  const body = ReactDOMServer.renderToStaticMarkup(<Fallback data={info} />);

  return ReactDOMServer.renderToStaticMarkup(
    // eslint-disable-next-line react/jsx-pascal-case
    <HTML
      title="404"
      description="Page not found"
      body={body}
      sheets={sheets}
    />
  );
}

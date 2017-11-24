/* @flow */
/* eslint-disable react/no-danger */

import * as React from 'react';

type Props = {
  title: string,
  description: string,
  body: string,
  sheet: ?string,
};

export default function HTML({ title, description, body, sheet }: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta name="description" content={description} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />

        <title>{title}</title>

        {sheet ? <link type="text/css" rel="stylesheet" href={sheet} /> : null}
      </head>
      <body dangerouslySetInnerHTML={{ __html: body }} />
    </html>
  );
}

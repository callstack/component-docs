import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import HTML from '../templates/HTML';
import App from '../templates/App';
import type { Metadata, PageInfo, Separator } from '../types';

type Options = {
  data: Array<Metadata | Separator>;
  info: PageInfo;
  github?: string;
  logo?: string;
  sheets: string[];
  scripts: string[];
  colors?: {
    primary?: string;
  };
  title?: string;
  favicon?: string;
};

export default function buildHTML({
  data,
  info,
  github,
  logo,
  sheets,
  scripts,
  colors = {},
  title,
  favicon,
}: Options): string {
  const html = ReactDOMServer.renderToString(
    <App
      logo={logo}
      path={info.link}
      data={data}
      github={github}
      title={title}
    />
  );

  let body = `
    <script>
      var theme;

      try {
        // Check if there is a preference saved
        theme = localStorage.getItem('preference-theme');
      } catch (e) {
        // Ignore
      }

      if (theme === undefined) {
        try {
          // If no preferred theme is set, read OS preference
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        } catch (e) {
          // Ignore
        }
      }

      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      }
    </script>
  `;

  body += `<div id='root'>${html}</div>`;

  body += `
    <style type="text/css">
      :root {
        --theme-primary-color: ${colors.primary || '#397AF9'};
      }
    </style>
  `;

  body += `
    <script>
      window.__INITIAL_PATH__ = '${info.link}';
    </script>
  `;

  body += '<script src="app.bundle.js"></script>';

  scripts.forEach((s) => {
    body += `<script src="${s}"></script>`;
  });

  const pageTitle =
    title !== undefined ? title.replace(/\[title\]/g, info.title) : info.title;

  return ReactDOMServer.renderToStaticMarkup(
    // eslint-disable-next-line react/jsx-pascal-case
    <HTML
      title={pageTitle}
      favicon={favicon || ''}
      description={(info.description || '').split('\n')[0]}
      body={body}
      sheets={sheets}
    />
  );
}

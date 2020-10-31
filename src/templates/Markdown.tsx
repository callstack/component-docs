import * as React from 'react';
import marked from 'marked';
import sanitize from 'sanitize-html';
import escape from 'escape-html';
import rehype from 'rehype';
import highlight from '../utils/highlight';

type Props = {
  source: string;
  className?: string;
};

const renderer = new marked.Renderer();

renderer.heading = function heading(...args) {
  return marked.Renderer.prototype.heading.apply(this, args).replace(
    /^(<h[1-3] [^>]+>)(.+)(<\/h[1-3]>)/,
    (_match: string, p1: string, p2: string, p3: string) => `${p1}
          <a class="anchor" href="#${p2
            .toLowerCase() // Strip HTML tags
            .replace(/(<([^>]+)>)/g, '')
            .replace(/[^a-z0-9]+/g, '-')}">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
            </svg>
          </a>
        ${p2}${p3}`
  );
};

export default class Markdown extends React.Component<Props> {
  render() {
    let html = marked(this.props.source, {
      renderer,
      gfm: true,
      silent: true,
      highlight: (code: string, lang: string) => {
        try {
          const nodes = highlight(code, lang);

          return rehype()
            .stringify({ type: 'root', children: nodes })
            .toString();
        } catch (err) {
          if (/Unknown language/.test(err.message)) {
            return escape(code);
          }

          throw err;
        }
      },
    });

    html = sanitize(html, require('../configs/santize-config.json'));

    return (
      <div // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: html,
        }}
        className={this.props.className}
      />
    );
  }
}

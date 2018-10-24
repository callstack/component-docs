/* @flow */

import * as React from 'react';
import { css, cx } from 'linaria';
import MarkdownIt from 'markdown-it';
import headings from 'markdown-it-github-headings';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';

const markdown = css`
  .anchor {
    margin-left: -20px;
    padding-right: 4px;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }

  h1:hover > .anchor,
  h2:hover > .anchor,
  h3:hover > .anchor,
  h4:hover > .anchor,
  h5:hover > .anchor,
  h6:hover > .anchor {
    opacity: 1;
  }

  /* Syntax highlighting */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #90a4ae;
  }

  .token.punctuation {
    color: #9e9e9e;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #e91e63;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #4caf50;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #795548;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #3f51b5;
  }

  .token.function {
    color: #f44336;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #ff9800;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;

type Props = {
  source: string,
  className?: string,
};

export default class Markdown extends React.Component<Props> {
  render() {
    const md = new MarkdownIt({
      linkify: true,
      html: true,
      highlight: (code, lang) => {
        const language = lang === 'js' ? languages.jsx : languages[lang];
        return language ? highlight(code, language) : null;
      },
    }).use(headings);

    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: md.render(this.props.source),
        }}
        className={cx(this.props.className, markdown)}
      />
    );
  }
}

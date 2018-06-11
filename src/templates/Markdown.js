/* @flow */

import * as React from 'react';
import Remarkable from 'remarkable';
import { highlight, getLanguage } from 'illuminate-js';
import { css, names } from 'linaria';

const markdown = css`
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
    const md = new Remarkable({
      linkify: true,
      html: true,
      highlight: (text, lang) => {
        const language = lang === 'js' ? 'jsx' : lang;
        return getLanguage(language) ? highlight(text, language) : null;
      },
    });

    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: md.render(this.props.source),
        }}
        className={names(this.props.className, markdown)}
      />
    );
  }
}

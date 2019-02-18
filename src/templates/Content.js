/* @flow */

import * as React from 'react';
import { css } from 'linaria';

const container = css`
  flex: 1;

  @media (min-width: 640px) {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const content = css`
  padding: 64px 24px 24px;

  @media (min-width: 640px) {
    padding: 64px;
  }

  @media (min-width: 960px) {
    padding: 86px;
  }

  .anchor {
    margin-left: -20px;
    margin-right: -1.5px;
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
  children: React.Node,
};

export default function Content({ children }: Props) {
  return (
    <main className={container}>
      <div className={content}>{children}</div>
    </main>
  );
}

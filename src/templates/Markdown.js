/* @flow */

import React from 'react';
import Remarkable from 'react-remarkable';
import hljs from 'highlight.js';
import { css } from '../lib/styling';

const markdown = css`
  & .hljs-comment {
    color: #ABB0B6;
  }

  & .hljs-keyword {
    color: #E91E63;
  }

  & .hljs-string, & .hljs-value, & .hljs-inheritance, & .hljs-header, & .hljs-class, & .hljs-attr {
    color: #4CAF50;
  }

  & .hljs-function .hljs-title {
    color: #FF5722;
  }

  & .hljs-number, & .hljs-preprocessor, & .hljs-built_in, & .hljs-literal, & .hljs-params, & .hljs-constant {
    color: #9C27B0;
  }

  & .hljs-variable, & .hljs-attr, & .hljs-tag, & .hljs-regexp, & .hljs-doctype, & .hljs-id, & .hljs-class, & .hljs-pseudo, & .hljs-tag .hljs-name, & .hljs-built_in {
    color: #3F51B5;
  }
`;

function highlight(text, lang) {
  const language = lang === 'jsx' ? 'xml' : lang;
  if (language) {
    if (hljs.getLanguage(language)) {
      try {
        return hljs.highlight(language, text).value;
      } catch (err) {
        // Do nothing
      }
    }
  } else {
    try {
      return hljs.highlightAuto(text).value;
    } catch (err) {
      // Do nothing
    }
  }

  return '';
}

export default function Markdown(props: any) {
  const { source, ...rest } = props;
  return (
    <div className={markdown} {...rest}>
      <Remarkable
        source={source}
        options={{
          linkify: true,
          highlight,
        }}
      />
    </div>
  );
}

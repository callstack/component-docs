/**
 * Used under license from Mapbox
 * https://github.com/mapbox/rehype-prism/blob/master/LICENSE
 */

import visit from 'unist-util-visit';
import nodeToString from 'hast-util-to-string';
import nodeToHTML from 'hast-util-to-html';
import refractor from 'refractor/core';

// Keep these in sync with Markdown
refractor.register(require('refractor/lang/clike'));
refractor.register(require('refractor/lang/javascript'));
refractor.register(require('refractor/lang/typescript'));
refractor.register(require('refractor/lang/markup'));
refractor.register(require('refractor/lang/jsx'));
refractor.register(require('refractor/lang/json'));
refractor.register(require('refractor/lang/bash'));
refractor.register(require('refractor/lang/swift'));
refractor.register(require('refractor/lang/java'));
refractor.register(require('refractor/lang/diff'));

const aliases = {
  js: 'jsx',
};

export default function() {
  /* eslint-disable no-param-reassign */
  return tree => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    const lang = getLanguage(node);

    if (lang === null) {
      return;
    }

    let result = node;

    try {
      parent.properties.className = (parent.properties.className || []).concat(
        `language-${lang}`
      );

      result = refractor.highlight(nodeToString(node), lang);
    } catch (err) {
      if (/Unknown language/.test(err.message)) {
        return;
      }

      throw err;
    }

    node.children = [];
    node.properties.dangerouslySetInnerHTML = {
      __html: nodeToHTML({
        type: 'root',
        children: result,
      }),
    };
  }
}

function getLanguage(node) {
  const className = node.properties.className || [];

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      const language = classListItem.slice(9).replace(/{.*/, '');
      const alias = aliases[language];
      return alias || language;
    }
  }

  return null;
}

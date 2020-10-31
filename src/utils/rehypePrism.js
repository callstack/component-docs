/**
 * Used under license from Mapbox
 * https://github.com/mapbox/rehype-prism/blob/master/LICENSE
 */

import visit from 'unist-util-visit';
import nodeToString from 'hast-util-to-string';
import nodeToHTML from 'hast-util-to-html';
import highlight from './highlight';

export default function () {
  /* eslint-disable no-param-reassign */
  return (tree) => {
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

      result = highlight(nodeToString(node), lang);
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
      return classListItem.slice(9).replace(/{.*/, '');
    }
  }

  return null;
}

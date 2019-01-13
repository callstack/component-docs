/* @flow */

import * as React from 'react';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import relative from 'require-relative';
import dashify from 'dashify';
import mdx from '@mdx-js/mdx';
import visit from 'unist-util-visit';
import { transformSync } from '@babel/core';
import getNameFromPath from '../utils/getNameFromPath';
import highlightCode from '../utils/highlightCode';
import Content from '../templates/Content';
import type { Metadata } from '../types';

export default function(
  filepath: string,
  { root }: { root: string }
): Metadata {
  const text = fs.readFileSync(filepath, 'utf-8');

  const code = mdx.sync(text, {
    filepath,
    mdPlugins: [
      () => tree => {
        visit(tree, 'code', node => {
          /* eslint-disable no-param-reassign */
          node.type = 'html';
          node.value = [
            `<pre><code class="language-${node.lang}">`,
            highlightCode(node.value, node.lang),
            `</code></pre>`,
          ].join('');
        });
      },
    ],
  });

  // Compile code to ES5 so we can run it
  const result = transformSync(
    `
    import * as React from 'react';
    import { MDXTag } from '@mdx-js/tag';

    ${code}
    `,
    {
      babelrc: false,
      configFile: false,
      presets: [
        require.resolve('@babel/preset-env'),
        require.resolve('@babel/preset-react'),
      ],
      plugins: [require.resolve('babel-plugin-react-html-attrs')],
    }
  ).code;

  const m = { exports: {} };
  const r = {};

  const script = new vm.Script(result, { filename: filepath });
  const dirname = path.dirname(filepath);

  script.runInContext(
    vm.createContext({
      module: m,
      exports: m.exports,
      require: name => {
        const resolved = relative.resolve(name, dirname);

        r[name] = resolved;

        return require(resolved);
      },
      process,
      __filename: filepath,
      __dirname: dirname,
    })
  );

  const component = m.exports.default;
  const meta = m.exports.meta || {};

  const title =
    meta.title ||
    component.displayName ||
    component.name ||
    getNameFromPath(filepath);
  const description = meta.description || '';
  const link = meta.link || dashify(title);
  const type = 'custom';

  return {
    filepath: path.relative(root, filepath),
    title,
    description,
    type,
    link,
    data: function MDXContent(props) {
      return React.createElement(
        Content,
        {},
        React.createElement(component, props)
      );
    },
    stringify() {
      /* $FlowFixMe */
      return String.raw`
(function() {
  var React = require('react');
  var Content = require(${JSON.stringify(
    require.resolve('../templates/Content')
  )}).default;

  var m = { exports: {} };
  var r = {
    ${Object.keys(r)
      .map(n => `${JSON.stringify(n)}: require(${JSON.stringify(r[n])})`)
      .join(',\n')}
  };

  (function(module, exports, require, __filename, __dirname) {
${result};
  }(
    m,
    m.exports,
    function(name) {
      return r[name];
    },
    ${JSON.stringify(filepath)},
    ${JSON.stringify(dirname)}
  ));

  var meta = m.exports.meta || {};

  return {
    title: meta.title || ${JSON.stringify(title)},
    link: meta.link || ${JSON.stringify(link)},
    description: meta.description,
    type: ${JSON.stringify(type)},
    data: function MDXContent(props) {
      return React.createElement(
        Content,
        {},
        React.createElement(m.exports.default, props)
      );
    },
  };
}())`;
    },
    dependencies: [],
  };
}

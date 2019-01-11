/* @flow */

import escape from 'escape-html';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';

export default function highlightCode(code: string, lang: string) {
  const grammar = lang === 'js' ? languages.jsx : languages[lang];
  return grammar ? highlight(code, grammar) : escape(code);
}

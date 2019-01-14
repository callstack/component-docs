/* @flow */

import refractor from 'refractor/core';

const aliases = {
  js: 'jsx',
};

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

export default function highlight(code: string, lang: string) {
  return refractor.highlight(code, aliases[lang] || lang);
}

/* @flow */

import fs from 'fs';
import { types } from 'recast';
import { parse, utils, defaultHandlers } from 'react-docgen';
import doctrine from 'doctrine';
import dashify from 'dashify';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

const REACT_STATICS = [
  'childContextTypes',
  'contextTypes',
  'defaultProps',
  'displayName',
  'getDerivedStateFromProps',
  'propTypes',
];

function staticPropertyHandler(documentation, path) {
  let statics = [];

  if (types.namedTypes.ClassDeclaration.check(path.node)) {
    statics = path
      .get('body', 'body')
      .filter(
        p =>
          p.node.static &&
          types.namedTypes.ClassProperty.check(p.node) &&
          !REACT_STATICS.includes(p.node.key.name)
      )
      .map(p => {
        let type = null;

        const typeAnnotation = utils.getTypeAnnotation(p);

        if (typeAnnotation) {
          type = utils.getFlowType(typeAnnotation);
        }

        const docblock = utils.docblock.getDocblock(p);

        return {
          name: p.node.key.name,
          description: doctrine.parse(docblock).description || null,
          docblock,
          value: p.node.value.value,
          type,
        };
      });
  }

  documentation.set('statics', statics);
}

export default function(file: string): Metadata {
  const info = parse(fs.readFileSync(file).toString(), undefined, [
    ...defaultHandlers,
    staticPropertyHandler,
  ]);
  const name = info.displayName || getNameFromPath(file);

  return {
    title: name,
    description: info.description,
    path: dashify(name),
    data: info,
    type: 'component',
  };
}

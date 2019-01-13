/* @flow */

import fs from 'fs';
import path from 'path';
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

function staticPropertyHandler(documentation, propertyPath) {
  let statics = [];

  if (types.namedTypes.ClassDeclaration.check(propertyPath.node)) {
    statics = propertyPath
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
          description: docblock ? doctrine.parse(docblock).description : null,
          docblock,
          value: p.node.value.value,
          type,
        };
      });
  }

  documentation.set('statics', statics);
}

export default function component(
  filepath: string,
  { root }: { root: string }
): Metadata {
  const info = parse(fs.readFileSync(filepath, 'utf-8'), undefined, [
    ...defaultHandlers,
    staticPropertyHandler,
  ]);
  const name = info.displayName || getNameFromPath(filepath);

  return {
    filepath: path.relative(root, filepath),
    title: name,
    description: info.description,
    link: dashify(name),
    data: info,
    type: 'component',
    dependencies: [],
  };
}

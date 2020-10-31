import fs from 'fs';
import path from 'path';
import { types } from 'recast';
import {
  parse,
  utils,
  defaultHandlers,
  Documentation,
  PropertyPath,
} from 'react-docgen';
import doctrine from 'doctrine';
import dashify from 'dashify';
import getNameFromPath from '../utils/getNameFromPath';
import type { Metadata } from '../types';

type StaticInfo = {
  name: string;
  description?: string;
  docblock?: string;
  value?: string;
  type?: {
    name: string;
    raw: string;
  };
  link?: string;
};

const REACT_STATICS = [
  'childContextTypes',
  'contextTypes',
  'defaultProps',
  'displayName',
  'getDerivedStateFromProps',
  'propTypes',
];

function staticPropertyHandler(
  documentation: Documentation,
  propertyPath: PropertyPath,
  componentName: string
) {
  let statics: StaticInfo[] = [];

  if (types.namedTypes.ClassDeclaration.check(propertyPath.node)) {
    statics = propertyPath
      .get('body', 'body')
      .filter(
        (p) =>
          p.node.static &&
          types.namedTypes.ClassProperty.check(p.node) &&
          !REACT_STATICS.includes(p.node.key.name)
      )
      .map((p) => {
        let type;

        const typeAnnotation = utils.getTypeAnnotation(p);

        if (typeAnnotation) {
          type = utils.getFlowType(typeAnnotation);
        }

        const docblock = utils.docblock.getDocblock(p);
        const name = p.node.key.name;

        const showLink = docblock == null;

        const staticInfo = {
          name,
          description: docblock
            ? doctrine.parse(docblock).description
            : undefined,
          docblock,
          value: p.node.value.value,
          type,
        };

        if (showLink) {
          return {
            ...staticInfo,
            type: { name: 'static', raw: 'static' },
            link: `${dashify(componentName)}-${dashify(name)}.html`,
          };
        }

        return staticInfo;
      });
  }

  documentation.set('statics', statics);
}

export default function component(
  filepath: string,
  { root }: { root: string }
): Metadata {
  let content = '';

  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');

  let skip = false;

  for (const line of lines) {
    if (line === '// @component-docs ignore-next-line') {
      skip = true;
      continue;
    }

    if (skip) {
      skip = false;
      continue;
    }

    content += line + '\n';
  }

  const info = parse(
    content,
    undefined,
    [
      ...defaultHandlers,
      (documentation, propertyPath) =>
        staticPropertyHandler(
          documentation,
          propertyPath,
          getNameFromPath(filepath)
        ),
    ],
    {
      cwd: root,
      filename: filepath,
    }
  );
  const name = info.displayName || getNameFromPath(filepath);

  return {
    filepath: path.relative(root, filepath),
    title: name,
    description: info.description,
    link: dashify(name),
    data: info,
    type: 'component',
    dependencies: [filepath],
    group: name.includes('.') ? name.split('.')[0] : undefined,
  };
}

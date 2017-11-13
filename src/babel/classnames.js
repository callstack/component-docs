/* @flow */

module.exports = function classnames(babel) {
  const { types: t } = babel;

  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.name === 'css') {
          const name = path.scope
            .generateUidIdentifier(path.parentPath.node.id.name)
            .name.replace(/^_/, '');

          // eslint-disable-next-line no-param-reassign
          path.node.tag = t.callExpression(
            t.memberExpression(t.identifier('css'), t.identifier('named')),
            [t.stringLiteral(name), t.stringLiteral(state.file.opts.filename)]
          );
        }
      },
    },
  };
};

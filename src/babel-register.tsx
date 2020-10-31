require('@babel/register')({
  ...require('./utils/getBabelOptions')({
    targets: { node: 'current' },
  }),
  extensions: ['.tsx', '.ts', '.js'],
});

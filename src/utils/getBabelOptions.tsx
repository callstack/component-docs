// Keep this commonjs as this is imported before babel is registered
module.exports = function getBabelOptions(options: Object): Object {
  return {
    presets: [
      [require.resolve('@babel/preset-env'), options],
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-flow'),
      require.resolve('@babel/preset-typescript'),
      [require.resolve('linaria/babel'), {}, 'component-docs-linaria'],
    ],
    plugins: [require.resolve('@babel/plugin-proposal-class-properties')],
  };
};

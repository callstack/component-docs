/* @flow */

import webpack from 'webpack';
import path from 'path';

const babelrc = {
  babelrc: false,
  presets: [
    ['env', { modules: false }],
    'react',
    'stage-2',
    require.resolve('./babel/preset'),
  ],
  env: {
    development: {
      presets: ['react-hmre'],
    },
  },
};

export default ({ root, entry, output, production }) => ({
  context: root,
  devtool: 'source-map',
  entry: production ? entry : ['webpack-hot-middleware/client', entry],
  output: {
    path: path.dirname(output),
    filename: path.basename(output),
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(production ? 'production' : 'development'),
      },
    }),
  ].concat(
    production
      ? [
          new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            sourceMap: true,
          }),
          new webpack.optimize.ModuleConcatenationPlugin(),
        ]
      : [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NamedModulesPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
        ]
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelrc,
        },
      },
      {
        test: /\.(bmp|gif|jpg|jpeg|png|svg|webp|ttf|otf)$/,
        use: { loader: 'url-loader', options: { limit: 25000 } },
      },
    ],
  },
});

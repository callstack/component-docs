/* @flow weak */

import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

type Options = {
  root: string,
  entry: string,
  production: boolean,
  output: {
    path: string,
    bundle: string,
    style: string,
  },
};

const babelrc = {
  babelrc: false,
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
    'linaria/babel',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};

export default ({ root, entry, output, production }: Options) => ({
  context: root,
  mode: production ? 'production' : 'development',
  devtool: 'source-map',
  entry: production ? entry : ['webpack-hot-middleware/client', entry],
  output: {
    path: output.path,
    filename: output.bundle,
    publicPath: '/',
  },
  optimization: {
    minimize: production,
    namedModules: true,
    concatenateModules: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(production ? 'production' : 'development'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: output.style,
    }),
  ].concat(
    production
      ? [new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })]
      : [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
        ]
  ),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelrc,
          },
          {
            loader: 'linaria/loader',
            options: { sourceMap: !production },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'css-hot-loader' },
          {
            loader: MiniCssExtractPlugin.loader,
            options: { sourceMap: !production },
          },
          {
            loader: 'css-loader',
            options: { sourceMap: !production },
          },
        ],
      },
    ],
  },
});

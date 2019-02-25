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
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
      },
    ],
    require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-flow'),
    require.resolve('@babel/preset-typescript'),
    require.resolve('linaria/babel'),
  ],
  plugins: [require.resolve('@babel/plugin-proposal-class-properties')],
};

export default ({ root, entry, output, production }: Options) => ({
  context: root,
  mode: production ? 'production' : 'development',
  devtool: 'source-map',
  entry: production
    ? entry
    : [require.resolve('webpack-hot-middleware/client'), entry],
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
            loader: require.resolve('babel-loader'),
            options: babelrc,
          },
          {
            loader: require.resolve('linaria/loader'),
            options: { sourceMap: !production, babelOptions: babelrc },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: require.resolve('css-hot-loader') },
          {
            loader: MiniCssExtractPlugin.loader,
            options: { sourceMap: !production },
          },
          {
            loader: require.resolve('css-loader'),
            options: { sourceMap: !production },
          },
        ],
      },
      {
        test: /\.(bmp|gif|jpg|jpeg|png|svg|webp|eot|woff|woff2|ttf)$/,
        use: {
          loader: require.resolve('file-loader'),
          options: {
            outputPath: 'assets/',
            publicPath: 'assets/',
          },
        },
      },
    ],
  },
});

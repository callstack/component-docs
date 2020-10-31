module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8.0.0',
        },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    'linaria/babel',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};

/* @flow */

module.exports = function preset() {
  return {
    // eslint-disable-next-line global-require
    plugins: [require('./classnames')],
  };
};

const { merge } = require('webpack-merge');

module.exports = (env) => {
  const name = env.prod ? 'prod' : 'dev';

  const config = require(`./config/webpack/${name}`);
  const common = require('./config/webpack/common');

  return merge(common, config);
};

const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = 'development';

module.exports = {
  mode: 'development',
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  devServer: {
    static: path.join(__dirname, '../../dist'),
    historyApiFallback: true,
    port: 5050,
  },
};

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.env.NODE_ENV = 'production';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  devtool: false,
  output: {
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
};

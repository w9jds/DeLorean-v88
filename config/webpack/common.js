const path = require('path');
const webpack = require('webpack');
const { DevfestDetails } = require('../../src/config/delorean.details.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ENV_DEST = process.env.ENV_DEST ? process.env.ENV_DEST : 'dev';

module.exports = {
  context: __dirname,
  entry: {
    'DeLorean-v88': ['../../src/index.tsx']
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.md$/,
        use: [
          { loader: 'html-loader' },
          { loader: 'markdown-loader' },
        ],
      },
      {
        test: /\.svg$/,
        exclude: [/node_modules/],
        loader: '@svgr/webpack',
        options: {
          svgo: false,
        }
      },
      {
        test: /\.svg$/,
        include: [/node_modules/],
        exclude: [/src/],
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/'
        }
      }
    ]
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        ENV_DEST: JSON.stringify(ENV_DEST),
        DELOREAN_API_KEY: JSON.stringify(process.env.WINDY_CITY_API_KEY),
        DELOREAN_MAP_API: JSON.stringify(process.env.DELOREAN_MAP_API),
        WINDY_CITY_EVENT_ID: JSON.stringify(process.env.WINDY_CITY_EVENT_ID),
      },
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      eventName: `${DevfestDetails.location} ${DevfestDetails.name} ${DevfestDetails.year}`,
      description: DevfestDetails.description,
      url: DevfestDetails.url,
      filename: 'index.html',
      environment: ENV_DEST,
      template: path.join(__dirname, '../template.ejs'),
    }),
  ],
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../../src/tsconfig.json'),
      })
    ],
    extensions: [".ts",".*.scss",".tsx",".js"],
    fallback: {
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    }
  }
};

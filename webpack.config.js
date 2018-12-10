const path = require('path');
const webpack = require('webpack');
const renderer = require('marked').Renderer();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { DevfestDetails } = require('./src/config/delorean.config.js');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
    context: __dirname,
    mode: NODE_ENV,
    entry: {
        'DeLorean-v88': ['babel-polyfill', 'isomorphic-fetch', './src/index.tsx']
    },
    optimization: {
        minimize: NODE_ENV !== 'development' ? true : false,
    },
    devtool: NODE_ENV !== 'development' ? false : 'sourcemap',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].[hash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader', 'source-map-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'sass-loader',
                ],
            },
            {
                test: /\.md$/,
                use: [
                    { loader: "html-loader" },
                    {
                        loader: "markdown-loader",
                        options: { pedantic: true, renderer }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    output: 'fonts/'
                }
            },
            {
                test: /\.svg$/,
                exclude: [/node_modules/],
                loaders: ['babel-loader',
                    {
                        loader: 'react-svg-loader',
                        query: {
                            jsx: true
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                include: [/node_modules/],
                exclude: [/src/],
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    outputPath: 'assets/'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    outputPath: 'assets/'
                }
            }
        ]
    },
    plugins: [
        // new FaviconsWebpackPlugin('./src/assets/event-logo.svg'),
        new ExtractTextPlugin('styles/main.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
                DELOREAN_API_KEY: JSON.stringify(process.env.DELOREAN_API_KEY),
                DELOREAN_MAP_API: JSON.stringify(process.env.DELOREAN_MAP_API),
                WINDY_CITY_EVENT_ID: JSON.stringify(process.env.WINDY_CITY_EVENT_ID),
            }
        }),
        new HtmlWebpackPlugin({
            eventName: `${DevfestDetails.location} ${DevfestDetails.name} ${DevfestDetails.year}`,
            description: DevfestDetails.description,
            url: DevfestDetails.url,
            filename: 'index.html',
            environment: NODE_ENV,
            template: path.join(__dirname, './template.ejs'),
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};

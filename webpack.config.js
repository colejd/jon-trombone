/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

// Get values from package.json
var package = require("./package.json");

let libraryName = package.name;

let plugins = [
  new WriteFilePlugin(),
  new CopyWebpackPlugin([
      { from: 'resources', to: 'resources' },
      { from: 'dependencies', to: 'dependencies' }
  ], {})
];
let outputFile;

const config = {
  //entry: '/src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: libraryName + '.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    publicPath: path.resolve(__dirname, '/dist/')
  },
  module: {
    rules: [
      { // Process js files
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
    //   { // Lint all js files with eslint-loader
    //     test: /(\.jsx|\.js)$/,
    //     loader: 'eslint-loader',
    //     exclude: /node_modules/
    //   }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins,
  devServer: {
    compress: true,
    open: true,
    openPage: 'testpage',
    publicPath: path.resolve(__dirname, '/dist/')
  },
  watchOptions: {
    ignored: /node_modules/
  }
};

module.exports = config;

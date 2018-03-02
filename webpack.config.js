/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

// Get values from package.json
var package = require("./package.json");

let libraryName = package.name;

let plugins = [
    new CopyWebpackPlugin([
        { from: '/resources/**/*', to: '/dist/resources' },
        { from: '/dependencies/**/*', to: '/dist/dependencies' }
    ], {})
];
let outputFile;

const config = {
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
    openPage: 'testpage'
  }
};

module.exports = config;

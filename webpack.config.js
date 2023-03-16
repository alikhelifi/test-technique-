const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
require('dotenv').config();
const isDev = process.env.NODE_ENV;
console.log(isDev);
module.exports = {
  devServer: {
    contentBasePublicPath: '/assets',
    hot: true,
    host: '0.0.0.0',
    port: '8004',
    stats: 'errors-only',
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/': {
        target: 'http://127.0.0.1:8004/',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        headers: { Connection: 'keep-alive' },
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'X-Powered-By': `Webpack Dev Server ${webpack.version}`,
    },
  },
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, '.'),
  target: 'node',
  node: {
    __dirname: true,
  },
  externals: [nodeExternals()],
  entry: {
    index: './app.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
  ],
  devtool: isDev ? 'inline-source-map' : undefined,
  output: {
    path: path.join(__dirname, isDev === 'development' ? 'dev' : 'dist'),
    filename: chunkData =>
      chunkData.chunk.name === 'Dokatis' ? '[name]' : '[name].bundle.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /database/],
        use: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /database/],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
};

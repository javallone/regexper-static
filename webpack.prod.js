const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = [
  // Web
  merge(common, {
    devtool: 'source-map',
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true
      }),
      new WorkboxPlugin({
        clientsClaim: true,
        skipWaiting: true
      })
    ]
  }),
  // Node (prerender)
  {
    target: 'node',
    externals: [nodeExternals({
      whitelist: [ /\.svg$/ ]
    })],
    entry: {
      prerender: './src/prerender.js'
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      path: path.resolve(__dirname, 'prerender')
    },
    plugins: [
      // Only want the EnvironmentPlugin
      common.plugins.find(plugin => plugin instanceof webpack.EnvironmentPlugin)
    ],
    module: {
      rules: [
        // Replace the rule for CSS files
        {
          test: /\.css$/,
          loader: 'css-loader/locals',
          options: {
            modules: true
          }
        },
        ...common.module.rules.filter(rule => !rule.test.test('file.css'))
      ]
    }
  }
];

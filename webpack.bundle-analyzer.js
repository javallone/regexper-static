const merge = require('webpack-merge');
const prod = require('./webpack.prod-web.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(prod, {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
});

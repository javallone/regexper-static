const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      dontCacheBustUrlsMatching: /icons-\w{8}|js|css/,
      runtimeCaching: [
        {
          urlPattern: /https?:\/\/licensebuttons\.net/,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /https?:\/\/fonts\.googleapis\.com/,
          handler: 'staleWhileRevalidate'
        },
        {
          urlPattern: /https?:\/\/fonts\.gstatic\.com/,
          handler: 'staleWhileRevalidate'
        }
      ]
    })
  ]
});

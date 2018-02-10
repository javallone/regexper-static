const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsPlugin = require('favicons-webpack-plugin-cesco');
const HtmlPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');

const pages = fs.readdirSync(path.resolve(__dirname, 'src/pages'));
const pagePlugins = pages.map(name => new HtmlPlugin({
  template: './src/template.html',
  filename: name.replace(/\.js$/, '.html'),
  chunks: ['common', name],
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
}));

module.exports = {
  entry: pages.reduce((pages, name) => {
    pages[name] = `./src/pages/${ name }`;
    return pages;
  }, {}),
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'build')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    }),
    new FaviconsPlugin({
      logo: './src/favicon.svg',
      persistentCache: true,
      inject: true,
      config: {
        appName: 'Regexper',
        appDescription: pkg.description,
        developerName: pkg.author.name,
        developerUrl: 'https://github.com/javallone/',
        background: '#6b6659',
        theme_color: '#bada55',
        start_url: '/',
        icons: {
          android: true,
          appleIcon: true,
          coast: false,
          favicons: true,
          firefox: false,
          windows: true,
          yandex: false
        }
      }
    }),
    new ExtractTextPlugin('css/[name].[contenthash:8].css'),
    new CopyPlugin(['./public']),
    ...pagePlugins
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss'
              }
            }
          ]
        })
      },
      {
        test: /\.svg$/,
        loader: 'svg-react-loader'
      }
    ]
  }
};

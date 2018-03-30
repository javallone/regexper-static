const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebappPlugin = require('webapp-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');
const buildId = [
  process.env.CIRCLE_BRANCH || 'prerelease',
  process.env.CIRCLE_BUILD_NUM || '##',
  (process.env.CIRCLE_SHA1 || 'gitsha').slice(0, 7)
].join('-');

const pages = fs.readdirSync(path.resolve(__dirname, 'src/pages'));
const pagePlugins = pages.map(name => new HtmlPlugin({
  description: pkg.description,
  buildId,
  template: './src/template.html',
  filename: `${ name }.html`,
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
  },
  ...require(`./src/pages/${ name }/config`)
}));

module.exports = {
  entry: pages.reduce((pages, name) => {
    pages[name] = `./src/pages/${ name }/browser`;
    return pages;
  }, {}),
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    modules: ['src', 'node_modules']
  },
  optimization: {
    splitChunks: {
      name: 'common',
      minChunks: 2
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEPLOY_ENV: 'development',
      GA_PROPERTY: null,
      SENTRY_KEY: null,
      BANNER: process.env.NODE_ENV === 'production' ? null : (process.env.NODE_ENV || 'development'),
      BUILD_ID: buildId
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash:8].css',
      allChunks: true
    }),
    new CopyPlugin(['./public']),
    ...pagePlugins,
    new WebappPlugin({ // MUST be after pagePlugins
      logo: './src/favicon.svg',
      prefix: 'icons-[hash:8]/',
      inject: true,
      favicons: {
        appName: 'Regexper',
        appDescription: pkg.description,
        developerURL: 'https://github.com/javallone/',
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
    })
  ],
  module: {
    rules: [
      {
        test: /locales/,
        loader: '@alienfast/i18next-loader',
        options: {
          basenameAsNamespace: true
        }
      },
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
                sourceMap: true,
                modules: true
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

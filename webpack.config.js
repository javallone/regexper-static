var webpack = require('webpack'),
    bourbon = require('bourbon'),
    config = require('./config');

module.exports = {
  devtool: 'source-map',
  entry: {
    'js/main.js': './src/js/main.js',
    '__discard__/css/main.css.js': './src/sass/main.scss',
    '__discard__/css/svg.css.js': './src/sass/svg.scss'
  },
  output: {
    path: config.buildRoot,
    filename: '[name]'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: require.resolve('snapsvg'),
        loader: 'imports-loader?this=>window,fix=>module.exports=0'
      },
      {
        test: /\.peg$/,
        loader: require.resolve('./lib/canopy-loader')
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: [
          'file-loader?name=css/[name].css',
          'extract-loader',
          'css-loader',
          'sass-loader?includePaths[]=' + bourbon.includePaths
        ]
      }
    ]
  }
};

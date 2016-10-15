module.exports = function(karma) {
  karma.set({
    frameworks: ['jasmine'],
    files: [ 'spec/test_index.js' ],
    preprocessors: {
      'spec/test_index.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'notify'],
    colors: true,
    logLevel: karma.LOG_INFO,
    browsers: ['Firefox'],
    autoWatch: true,
    singleRun: false,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel'
          },
          {
            test: require.resolve('snapsvg'),
            loader: 'imports-loader?this=>window,fix=>module.exports=0'
          },
          {
            test: /\.peg$/,
            loader: require.resolve('./lib/canopy-loader')
          }
        ]
      }
    }
  });
};

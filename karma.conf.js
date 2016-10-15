var webpack = require('./webpack.config.js');

module.exports = function(karma) {
  karma.set({
    frameworks: ['browserify', 'jasmine'],
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
      module: webpack.module
    }
  });
};

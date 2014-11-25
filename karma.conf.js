var _ = require('lodash'),
    config = require('./config');

module.exports = function(karma) {
  var globs = [config.globs.js, config.globs.spec];

  karma.set({
    frameworks: ['browserify', 'jasmine'],
    files: globs,
    preprocessors: _(globs)
      .zipObject()
      .mapValues(_.constant(['browserify']))
      .valueOf(),
    reporters: ['progress', 'notify'],
    colors: true,
    logLevel: karma.LOG_INFO,
    browsers: ['PhantomJS'],
    autoWatch: true,
    singleRun: false,
    browserify: _.defaults({}, config.browserify, {
      prebundle: function(bundle) {
        bundle.add([require('es6ify').runtime]);
      }
    })
  });
};

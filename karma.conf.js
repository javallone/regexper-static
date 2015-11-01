var _ = require('lodash'),
    config = require('./config');

module.exports = function(karma) {
  var globs = _.flatten([
    config.globs.js,
    config.globs.spec
  ]);

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
    browsers: ['Chrome'],
    autoWatch: true,
    singleRun: false,
    browserify: _.extend({
      configure: function(bundler) {
        bundler.transform(require('./lib/canopy-transform'));
        bundler.transform(require('babelify'));
      }
    }, config.browserify)
  });
};

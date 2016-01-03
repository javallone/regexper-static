var _ = require('lodash'),
    config = require('./config');

module.exports = function(karma) {
  var globs = _.flatten([
    config.globs.js,
    config.globs.spec
  ]),
    browser = 'Chrome';

  if (process.env.TRAVIS) {
    globs.unshift('node_modules/babel-polyfill/dist/polyfill.js');
    browser = 'PhantomJS';
  }

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
    browsers: [browser],
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

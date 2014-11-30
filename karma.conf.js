var _ = require('lodash'),
    config = require('./config');

module.exports = function(karma) {
  var globs = _.flatten([config.globs.js, config.globs.spec]);

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
        var es6ify = require('es6ify');

        bundle.add([es6ify.runtime]);
        bundle.transform(require('./lib/canopy-transform'));
        bundle.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/));
      }
    })
  });
};

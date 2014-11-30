var path = require('path'),
    _ = require('lodash'),
    buildRoot = process.env.BUILD_PATH || './build',
    buildPath = _.bind(path.join, path, buildRoot);

module.exports = {
  buildRoot: buildRoot,
  buildPath: buildPath,
  templateFile: './template.html',
  globs: {
    other: './src/**/*.!(html|scss|js|peg)',
    html: './src/**/*.html',
    sass: './src/**/*.scss',
    js: ['./src/**/*.js', './src/**/*.peg'],
    spec: './spec/**/*_spec.js'
  },
  compass: {
    sass: './src/sass',
    css: buildPath('css'),
    javascript: buildPath('js'),
    font: buildPath('font'),
    sourcemap: true
  },
  browserify: {
    basedir: './src/js',
    debug: true,
    fullPaths: false,
    prebundle: function(bundle) {
      var es6ify = require('es6ify');

      bundle.add(es6ify.runtime);
      bundle.transform(require('./lib/canopy-transform'));
      bundle.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/));
    }
  }
};

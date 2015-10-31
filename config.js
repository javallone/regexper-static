var path = require('path'),
    _ = require('lodash'),
    es6ify = require('es6ify'),
    buildRoot = process.env.BUILD_PATH || './build',
    buildPath = _.bind(path.join, path, buildRoot);

module.exports = {
  buildRoot: buildRoot,
  buildPath: buildPath,
  globs: {
    other: './src/**/*.!(hbs|scss|js|peg)',
    templates: './src/**/*.hbs',
    data: ['./lib/data/**/*.json', './lib/data/**/*.js'],
    helpers: './lib/helpers/**/*.js',
    partials: './lib/partials/**/*.hbs',
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
    debug: true,
    fullPaths: false,
    entries: [es6ify.runtime],
  },
  prebundle: function(bundle) {
    bundle.transform(require('./lib/canopy-transform'));
    bundle.transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/));
  }
};

var path = require('path'),
    _ = require('lodash'),
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
  browserify: {
    debug: true,
    fullPaths: false,
  }
};

const gulp = require('gulp-help')(require('gulp')),
      _ = require('lodash'),
      notify = require('gulp-notify'),
      folderToc = require('folder-toc'),
      docco = require('gulp-docco'),
      connect = require('gulp-connect'),
      hb = require('gulp-hb'),
      frontMatter = require('gulp-front-matter'),
      rename = require('gulp-rename'),
      config = require('./config'),
      gutil = require('gulp-util'),
      webpack = require('webpack')
      webpackConfig = require('./webpack.config'),
      fs = require('fs');

gulp.task('default', 'Auto-rebuild site on changes.', ['server', 'docs'], function() {
  gulp.watch(config.globs.other, ['static']);
  gulp.watch(_.flatten([
    config.globs.templates,
    config.globs.data,
    config.globs.helpers,
    config.globs.partials,
    config.globs.svg_sass
  ]), ['markup']);
  gulp.watch(_.flatten([
    config.globs.sass,
    config.globs.js
  ]), ['webpack']);
  gulp.watch(config.globs.js, ['docs']);
});

gulp.task('docs', 'Build documentation into ./docs directory.', ['docs:files'], function() {
  folderToc('./docs', {
    filter: '*.html'
  });
});

gulp.task('docs:files', false, function() {
  return gulp.src(config.globs.js)
    .pipe(docco())
    .pipe(gulp.dest('./docs'));
});

gulp.task('server', 'Start development server.', ['build'], function() {
  gulp.watch(config.buildPath('**/*'), function(file) {
    return gulp.src(file.path).pipe(connect.reload());
  });

  return connect.server({
    root: config.buildRoot,
    livereload: true
  });
});

gulp.task('build', 'Build site into ./build directory.', ['static', 'webpack', 'markup']);

gulp.task('static', 'Build static files into ./build directory.', function() {
  return gulp.src(config.globs.other, { base: './src' })
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup', 'Build markup into ./build directory.', ['webpack'], function() {
  var hbStream = hb({
    data: config.globs.data,
    helpers: config.globs.helpers,
    partials: config.globs.partials,
    parsePartialName: function(option, file) {
      return _.last(file.path.split(/\\|\//)).replace('.hbs', '');
    },
    bustCache: true
  });
  hbStream.partials({
    svg_styles: fs.readFileSync(__dirname + '/build/css/svg.css').toString()
  });
  if (process.env.GA_PROP) {
    hbStream.data({
      'gaPropertyId': process.env.GA_PROP
    });
  }
  if (process.env.SENTRY_KEY) {
    hbStream.data({
      'sentryKey': process.env.SENTRY_KEY
    });
  }
  return gulp.src(config.globs.templates)
    .pipe(frontMatter())
    .pipe(hbStream)
    .on('error', notify.onError())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('webpack', 'Build JS & CSS into ./build directory.', function(callback) {
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString());
    callback();
  });
});

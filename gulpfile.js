var gulp = require('gulp'),
    config = require('./config');

gulp.task('default', ['server'], function() {
  gulp.watch(config.globs.other, ['static']);
  gulp.watch([config.globs.html, config.templateFile], ['markup']);
  gulp.watch(config.globs.sass, ['compass']);
  gulp.watch(config.globs.js, ['browserify']);
});

gulp.task('server', ['build'], function() {
  var connect = require('gulp-connect'),
      watch = require('gulp-watch');

  watch('./build/**/*', { name: 'Server' })
    .pipe(connect.reload());
  return connect.server({
    root: './build',
    livereload: true
  });
});

gulp.task('build', ['static', 'markup', 'compass', 'browserify']);

gulp.task('static', function() {
  return gulp.src(config.globs.other)
    .pipe(gulp.dest('./build'));
});

gulp.task('markup', function() {
  var wrap = require('gulp-wrap');

  return gulp.src(config.globs.html)
    .pipe(wrap({ src: config.templateFile }))
    .pipe(gulp.dest('./build'));
});

gulp.task('compass', function() {
  var compass = require('gulp-compass');

  return gulp.src(config.globs.sass)
    .pipe(compass(config.compass));
});

gulp.task('browserify', function() {
  var browserify = require('browserify'),
      es6ify = require('es6ify'),
      source = require('vinyl-source-stream');
      bundler = browserify(config.browserify);

  bundler.add(es6ify.runtime);
  bundler.transform(es6ify);

  return bundler
    .bundle()
    .pipe(source('js/main.js'))
    .pipe(gulp.dest('./build'));
});

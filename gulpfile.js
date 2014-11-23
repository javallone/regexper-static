var gulp = require('gulp');

gulp.task('default', ['server'], function() {
  gulp.watch('./src/**/*.!(html|scss|js)', ['static']);
  gulp.watch(['./src/**/*.html', './template.html'], ['markup']);
  gulp.watch('./src/**/*.scss', ['compass']);
  gulp.watch('./src/**/*.js', ['browserify']);
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
  return gulp.src('./src/**/*.!(html|scss|js)')
    .pipe(gulp.dest('./build'));
});

gulp.task('markup', function() {
  var wrap = require('gulp-wrap');

  return gulp.src('./src/**/*.html')
    .pipe(wrap({ src: './template.html' }))
    .pipe(gulp.dest('./build'));
});

gulp.task('compass', function() {
  var compass = require('gulp-compass');

  return gulp.src('./src/**/*.scss')
    .pipe(compass({
      sass: './src/sass',
      css: './build/css',
      javascript: './build/js',
      font: './build/font',
      sourcemap: true
    }));
});

gulp.task('browserify', function() {
  var browserify = require('browserify'),
      es6ify = require('es6ify'),
      source = require('vinyl-source-stream');
      bundler = browserify({
        entries: ['./main.js'],
        basedir: './src/js',
        debug: true,
      });

  bundler.add(es6ify.runtime);
  bundler.transform(es6ify);

  return bundler
    .bundle()
    .pipe(source('js/main.js'))
    .pipe(gulp.dest('./build'));
});

var gulp = require('gulp'),
    wrap = require('gulp-wrap'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    compass = require('gulp-compass');

gulp.task('default', ['server'], function() {
  gulp.watch('./src/**/*.!(html|scss)', ['static']);
  gulp.watch(['./src/**/*.html', './template.html'], ['markup']);
  gulp.watch('./src/**/*.scss', ['compass']);
});

gulp.task('server', ['static', 'markup', 'compass'], function() {
  watch('./build/**/*', { name: 'Server' })
    .pipe(connect.reload());
  return connect.server({
    root: './build',
    livereload: true
  });
});

gulp.task('static', function() {
  return gulp.src('./src/**/*.!(html|scss)')
    .pipe(gulp.dest('./build'));
});

gulp.task('markup', function() {
  return gulp.src('./src/**/*.html')
    .pipe(wrap({ src: './template.html' }))
    .pipe(gulp.dest('./build'));
});

gulp.task('compass', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(compass({
      project: __dirname,
      sass: './src/sass',
      css: './build/css',
      javascript: './build/js',
      font: './build/font',
      sourcemap: true
    }));
});

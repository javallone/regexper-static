var gulp = require('gulp'),
    wrap = require('gulp-wrap'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch');

gulp.task('default', ['server'], function() {
  gulp.watch('./src/**/*.html', ['markup']);
});

gulp.task('server', ['markup'], function() {
  watch('./build/**/*', { name: 'Server' })
    .pipe(connect.reload());
  return connect.server({
    root: './build',
    livereload: true
  });
});

gulp.task('markup', function() {
  return gulp.src('./src/**/*.html')
    .pipe(wrap({ src: './template.html' }))
    .pipe(gulp.dest('./build'))
});

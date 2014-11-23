var gulp = require('gulp'),
    wrap = require('gulp-wrap');

gulp.task('default', function() {
  console.log('Default task');
});

gulp.task('markup', function() {
  return gulp.src('./src/**/*.html')
    .pipe(wrap({ src: './template.html' }))
    .pipe(gulp.dest('./build'))
});

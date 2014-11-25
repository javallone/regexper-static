var gulp = require('gulp'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browserify = require('browserify'),
    es6ify = require('es6ify'),
    tap = require('gulp-tap'),
    config = require('./config');

function errorHandler() {
  return plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  });
}

function browserifyPipe() {
  return tap(function(file) {
    var bundler = browserify(config.browserify);

    bundler.add([file.path, es6ify.runtime]);
    bundler.transform(require('./lib/canopy-transform'));
    bundler.transform(es6ify);

    file.contents = bundler.bundle();
  });
}

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
  return gulp.src(config.globs.other, { base: 'src' })
    .pipe(errorHandler())
    .pipe(gulp.dest('./build'));
});

gulp.task('markup', function() {
  var wrap = require('gulp-wrap');

  return gulp.src(config.globs.html, { base: 'src' })
    .pipe(errorHandler())
    .pipe(wrap({ src: config.templateFile }))
    .pipe(gulp.dest('./build'));
});

gulp.task('compass', function() {
  var compass = require('gulp-compass');

  return gulp.src(config.globs.sass)
    .pipe(errorHandler())
    .pipe(compass(config.compass));
});

gulp.task('browserify', function() {
  return gulp.src('./src/js/main.js', { read: false })
    .pipe(errorHandler())
    .pipe(browserifyPipe())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('karma', function(done) {
  var karma = require('karma'),
      path = require('path');

  karma.server.start({
    configFile: path.join(__dirname, 'karma.conf.js')
  }, done);
});

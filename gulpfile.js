var gulp = require('gulp'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    config = require('./config');

function errorHandler() {
  return plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
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

  watch(config.buildPath('**/*'), { name: 'Server' })
    .pipe(connect.reload());

  return connect.server({
    root: config.buildRoot,
    livereload: true
  });
});

gulp.task('build', ['static', 'markup', 'compass', 'browserify']);

gulp.task('static', function() {
  return gulp.src(config.globs.other, { base: './src' })
    .pipe(errorHandler())
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup', function() {
  var wrap = require('gulp-wrap'),
      path = require('path');

  return gulp.src(config.globs.html, { base: './src' })
    .pipe(errorHandler())
    .pipe(wrap({ src: config.templateFile }, {
      title: function() {
        var root = path.join(this.file.cwd, this.file.base),
            file = path.relative(root, this.file.history[0]);

        return config.titles[file] || config.titles['_'];
      }
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('compass', function() {
  var compass = require('gulp-compass');

  return gulp.src(config.globs.sass)
    .pipe(errorHandler())
    .pipe(compass(config.compass));
});

gulp.task('browserify', function() {
  var browserify = require('browserify'),
      exorcist = require('exorcist'),
      tap = require('gulp-tap'),
      transform = require('vinyl-transform');

  return gulp.src('./src/js/main.js', { read: false })
    .pipe(errorHandler())
    .pipe(tap(function(file) {
      var bundler = browserify(config.browserify);

      config.browserify.prebundle(bundler);

      bundler.add(file.path);

      file.contents = bundler.bundle();
    }))
    .pipe(transform(function() {
      return exorcist(config.buildPath('js/main.js.map'));
    }))
    .pipe(gulp.dest(config.buildPath('js')));
});

gulp.task('karma', function(done) {
  var karma = require('karma'),
      path = require('path');

  karma.server.start({
    configFile: path.join(__dirname, 'karma.conf.js')
  }, done);
});

var gulp = require('gulp'),
    _ = require('lodash'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    config = require('./config');

function errorHandler() {
  return plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  });
}

gulp.task('default', ['server', 'docs'], function() {
  gulp.watch(config.globs.other, ['static']);
  gulp.watch(_.flatten([
    config.globs.templates,
    config.globs.data,
    config.globs.helpers,
    config.globs.partials,
    config.globs.sass
  ]), ['markup']);
  gulp.watch(config.globs.js, ['browserify', 'docs']);
});

gulp.task('docs', ['docs:files'], function() {
  var folderToc = require('folder-toc');

  folderToc('./docs', {
    filter: '*.html'
  });
});

gulp.task('docs:files', function() {
  var docco = require('gulp-docco');

  return gulp.src(config.globs.js)
    .pipe(docco())
    .pipe(gulp.dest('./docs'));
});

gulp.task('server', ['build'], function() {
  var connect = require('gulp-connect');

  gulp.watch(config.buildPath('**/*'), function(file) {
    return gulp.src(file.path).pipe(connect.reload());
  });

  return connect.server({
    root: config.buildRoot,
    livereload: true
  });
});

gulp.task('build', ['static', 'markup', 'styles', 'scripts']);

gulp.task('static', function() {
  return gulp.src(config.globs.other, { base: './src' })
    .pipe(errorHandler())
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup', ['styles'], function() {
  var hb = require('gulp-hb'),
      frontMatter = require('gulp-front-matter'),
      rename = require('gulp-rename');

  return gulp.src(config.globs.templates)
    .pipe(errorHandler())
    .pipe(frontMatter())
    .pipe(hb({
      data: config.globs.data,
      helpers: config.globs.helpers,
      partials: config.globs.partials,
      bustCache: true,
    }))
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('styles', function() {
  var sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename');

  return gulp.src(config.globs.sass)
    .pipe(errorHandler())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.buildPath('css')));
});

gulp.task('scripts', function() {
  var browserify = require('browserify'),
      tap = require('gulp-tap');

  return gulp.src('./src/js/main.js', { read: false })
    .pipe(errorHandler())
    .pipe(tap(function(file) {
      var bundler = browserify(config.browserify);

      config.prebundle(bundler);

      bundler.add(file.path);

      file.contents = bundler.bundle();
    }))
    .pipe(gulp.dest(config.buildPath('js')));
});

gulp.task('karma', function(done) {
  var karma = require('karma'),
      path = require('path'),
      server = new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js')
      }, done);

  server.start();
});

gulp.task('karma:single', function(done) {
  var karma = require('karma'),
      path = require('path'),
      server = new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true
      }, done);

  server.start();
});

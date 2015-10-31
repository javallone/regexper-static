var gulp = require('gulp'),
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
  gulp.watch([config.globs.html, config.templateFile, config.globs.sass], ['markup']);
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
  var wrap = require('gulp-wrap'),
      path = require('path'),
      fs = require('fs');

  return gulp.src(config.globs.html, { base: './src' })
    .pipe(errorHandler())
    .pipe(wrap({ src: config.templateFile }, {
      date: new Date().toISOString(),
      title: function() {
        var root = path.join(this.file.cwd, this.file.base),
            file = path.relative(root, this.file.history[0]);

        return config.titles[file] || config.titles['_'];
      },
      svgStyles: fs.readFileSync(path.join(config.compass.css, 'svg.css'), {
        encoding: 'utf-8'
      })
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('styles', function() {
  var compass = require('gulp-compass');

  return gulp.src(config.globs.sass)
    .pipe(errorHandler())
    .pipe(compass(config.compass));
});

gulp.task('scripts', function() {
  var browserify = require('browserify'),
      tap = require('gulp-tap');

  return gulp.src('./src/js/main.js', { read: false })
    .pipe(errorHandler())
    .pipe(tap(function(file) {
      var bundler = browserify(config.browserify);

      config.browserify.prebundle(bundler);

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

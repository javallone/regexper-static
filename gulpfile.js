var gulp = require('gulp'),
    _ = require('lodash'),
    notify = require('gulp-notify'),
    config = require('./config');

gulp.task('default', ['server', 'docs'], function() {
  gulp.watch(config.globs.other, ['static']);
  gulp.watch(_.flatten([
    config.globs.templates,
    config.globs.data,
    config.globs.helpers,
    config.globs.partials,
    config.globs.svg_sass
  ]), ['markup']);
  gulp.watch(config.globs.sass, ['styles']);
  gulp.watch(config.globs.js, ['scripts', 'docs']);
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
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup', ['markup:svg_styles'], function() {
  var hb = require('gulp-hb'),
      frontMatter = require('gulp-front-matter'),
      rename = require('gulp-rename');

  return gulp.src(config.globs.templates)
    .pipe(frontMatter())
    .pipe(hb({
      data: config.globs.data,
      helpers: config.globs.helpers,
      partials: _.flatten([
        config.globs.partials,
        './tmp/build/svg_styles.hbs'
      ]),
      parsePartialName: function(file) {
        return _.last(file.shortPath.split('/'));
      },
      bustCache: true
    }))
    .on('error', notify.onError())
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup:svg_styles', function() {
  var sass = require('gulp-sass'),
      rename = require('gulp-rename');

  return gulp.src('./src/sass/svg.scss')
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .on('error', notify.onError())
    .pipe(rename(function(path) {
      path.dirname = '';
      path.basename = 'svg_styles';
      path.extname = '.hbs';
    }))
    .pipe(gulp.dest('./tmp/build'))
});

gulp.task('styles', function() {
  var sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'),
      rename = require('gulp-rename');

  return gulp.src('./src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: require('node-bourbon').includePaths
    }))
    .on('error', notify.onError())
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.buildPath('css')))
});

gulp.task('scripts', function() {
  var browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      sourcemaps = require('gulp-sourcemaps'),
      rename = require('gulp-rename');

  var b = browserify(config.browserify)
    .transform(require('./lib/canopy-transform'))
    .transform(require('babelify'))
    .add('./src/js/main.js');

  return b.bundle()
    .on('error', notify.onError())
    .pipe(source('./src/js/main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename(function(path) {
      path.dirname = '';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.buildPath('js')));
});

gulp.task('verify', ['karma:single', 'lint']);

gulp.task('verify:watch', ['karma', 'lint:watch']);

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

gulp.task('lint', function() {
  var jscs = require('gulp-jscs');

  return gulp.src(config.globs.lint)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .on('error', notify.onError())
});

gulp.task('lint:watch', function() {
  gulp.watch(config.globs.lint, ['lint']);
});

gulp.task('lint:fix', config.lintRoots.map(function(root) {
  return 'lint:fix:' + root;
}), function() {
  var jscs = require('gulp-jscs');

  return gulp.src('./*.js')
    .pipe(jscs({fix: true}))
    .pipe(gulp.dest('.'));
});

config.lintRoots.forEach(function(root) {
  gulp.task('lint:fix:' + root, function() {
    var jscs = require('gulp-jscs');

    return gulp.src('./' + root + '/**/*.js')
      .pipe(jscs({fix: true}))
      .pipe(gulp.dest('./' + root));
  });
});

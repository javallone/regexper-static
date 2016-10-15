const gulp = require('gulp-help')(require('gulp')),
      _ = require('lodash'),
      notify = require('gulp-notify'),
      folderToc = require('folder-toc'),
      docco = require('gulp-docco'),
      connect = require('gulp-connect'),
      hb = require('gulp-hb'),
      frontMatter = require('gulp-front-matter'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      bourbon = require('node-bourbon'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      sourcemaps = require('gulp-sourcemaps'),
      babelify = require('babelify'),
      path = require('path'),
      jscs = require('gulp-jscs'),
      config = require('./config');

gulp.task('default', 'Auto-rebuild site on changes.', ['server', 'docs'], function() {
  gulp.watch(config.globs.other, ['static']);
  gulp.watch(_.flatten([
    config.globs.templates,
    config.globs.data,
    config.globs.helpers,
    config.globs.partials,
    config.globs.svg_sass
  ]), ['markup']);
  gulp.watch(config.globs.sass, ['styles']);
  gulp.watch(config.globs.js, ['docs']);
});

gulp.task('docs', 'Build documentation into ./docs directory.', ['docs:files'], function() {
  folderToc('./docs', {
    filter: '*.html'
  });
});

gulp.task('docs:files', false, function() {
  return gulp.src(config.globs.js)
    .pipe(docco())
    .pipe(gulp.dest('./docs'));
});

gulp.task('server', 'Start development server.', ['build'], function() {
  gulp.watch(config.buildPath('**/*'), function(file) {
    return gulp.src(file.path).pipe(connect.reload());
  });

  return connect.server({
    root: config.buildRoot,
    livereload: true
  });
});

gulp.task('build', 'Build site into ./build directory.', ['static', 'markup', 'styles']);

gulp.task('static', 'Build static files into ./build directory.', function() {
  return gulp.src(config.globs.other, { base: './src' })
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup', 'Build markup into ./build directory.', ['markup:svg_styles'], function() {
  return gulp.src(config.globs.templates)
    .pipe(frontMatter())
    .pipe(hb({
      data: config.globs.data,
      helpers: config.globs.helpers,
      partials: _.flatten([
        config.globs.partials,
        './tmp/build/svg_styles.hbs'
      ]),
      parsePartialName: function(option, file) {
        return _.last(file.path.split(/\\|\//)).replace('.hbs', '');
      },
      bustCache: true
    }))
    .on('error', notify.onError())
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('markup:svg_styles', false, function() {
  return gulp.src('./src/sass/svg.scss')
    .pipe(sass({
      includePaths: bourbon.includePaths,
      outputStyle: 'compressed'
    }))
    .on('error', notify.onError())
    .pipe(rename({
      dirname: '',
      basename: 'svg_styles',
      extname: '.hbs'
    }))
    .pipe(gulp.dest('./tmp/build'))
});

gulp.task('styles', 'Build stylesheets into ./build directory.', function() {
  return gulp.src('./src/sass/main.scss', { base: '.' })
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: bourbon.includePaths,
      outputStyle: 'compressed'
    }))
    .on('error', notify.onError())
    .pipe(rename({ dirname: '' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.buildPath('css')))
});

gulp.task('verify', 'Verify (lint and run tests) scripts.', ['lint']);

gulp.task('verify:watch', 'Auto-verify scripts.', ['lint:watch']);

gulp.task('lint', 'Lint scripts', function() {
  return gulp.src(config.globs.lint)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .on('error', notify.onError())
});

gulp.task('lint:watch', 'Auto-lint scripts', function() {
  gulp.watch(config.globs.lint, ['lint']);
});

gulp.task('lint:fix', 'Fix some lint errors.', config.lintRoots.map(function(root) {
  return 'lint:fix:' + root;
}), function() {
  return gulp.src('./*.js')
    .pipe(jscs({fix: true}))
    .pipe(gulp.dest('.'));
});

config.lintRoots.forEach(function(root) {
  gulp.task('lint:fix:' + root, false, function() {
    return gulp.src('./' + root + '/**/*.js')
      .pipe(jscs({fix: true}))
      .pipe(gulp.dest('./' + root));
  });
});

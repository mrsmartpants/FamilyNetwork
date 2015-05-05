var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
var nodeInspector = require('gulp-node-inspector');

//Prints a help screen of all available tasks
gulp.task('help', taskListing.withFilters(/:/));

gulp.task('test', ['test:lint', 'test:mocha']);

gulp.task('test:lint', function () {
  return gulp.src(['./app/*.js', 'app.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', gutil.log);

});

gulp.task('test:mocha', function () {
  return gulp.src(['test/**/*.js'], {read: false})
    .pipe(mocha({reporter: 'spec'}))
    .on('error', gutil.log);
});


gulp.task('serve', ['debug'], function () {
  nodemon({
    script: 'app.js',
    nodeArgs: ['--debug-brk'],
    env: {
      PORT: process.env.PORT || 9000
    }
  })
    .on('config:update', function () {
      setTimeout(function () {
        require('open')('http://localhost:8080/debug?port=5858');
      }, 500);
    });
});

gulp.task('debug', function () {
  gulp.src([])
    .pipe(nodeInspector({
      'web-host': 'localhost'
    }));
});


gulp.task('default', ['test', 'serve']);

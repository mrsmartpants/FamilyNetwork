var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
var nodeInspector = require('gulp-node-inspector');
var istanbul = require('gulp-istanbul');

//Prints a help screen of all available tasks
gulp.task('help', taskListing.withFilters(/:/));

//Testing tasks
gulp.task('test', ['test:lint', 'test:mocha']);

gulp.task('test:mocha', function () {
  //set the NODE_ENV to test
  process.env.NODE_ENV = 'test';

  return gulp.src(['app/**/*.js', 'app.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      return gulp.src('./test/**/*.js')
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports())
        .once('error', function () {
          process.exit(1);
        })
        .once('end', function () {
          process.exit();
        });
    });
});

gulp.task('test:lint', function () {
  return gulp.src('./test/**/*.js')
    .pipe(jshint('.jshintrc-spec'))
    .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('lint', function () {
  return gulp.src(['./app/**/*.js', 'app.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));

});


//Server tasks
gulp.task('serve', ['serve:debug'], function () {
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
    })
    .on('restart', function () {
      gulp.start('test:lint');
    })
});

gulp.task('serve:debug', function () {
  gulp.src([])
    .pipe(nodeInspector({
      'web-host': 'localhost'
    }));
});


gulp.task('default', ['lint', 'serve']);

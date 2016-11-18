const gulp = require('gulp');
const lint = require('tslint');
const tslint = require('gulp-tslint');
const through = require('through');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

var config = lint.findConfiguration();
gulp.task('tslint-positive', function() {
  return gulp.src('spec/*.pass.ts')
    .pipe(tslint({
      configuration: config,
      formatter: 'verbose'
    }));
    .pipe(tslint.report());
});

gulp.task('tslint-negative', function() {
  return gulp.src('spec/*.fail.ts')
    .pipe(tslint({
      configuration: config
    }))
    .pipe((function() {
      var hasError = false;
      return through(function(file) {
        if (file.tslint.failureCount === 0) {
          gutil.log(
            `[${gutil.colors.cyan('gulp-tslint')}]`,
            gutil.colors.red('error'),
            `(negative) ${file.relative}`);
          hasError = true;
        }
      }, function() {
        if (hasError) {
          this.emit('error', new PluginError('gulp-tslint', 'Failed negative test(s).'));
        } else {
          this.emit('end');
        }
      });
    })());
});

gulp.task('tslint', ['tslint-positive', 'tslint-negative']);

gulp.task('default', ['tslint']);

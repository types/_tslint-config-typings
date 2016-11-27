const gulp = require('gulp');
const gulpTslint = require('gulp-tslint');
const tslint = require('tslint');
const through = require('through');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

gulp.task('tslint-positive', function() {
  return gulp.src('spec/*.pass.ts')
    .pipe(gulpTslint({
      configuration: './tslint.json',
      formatter: 'verbose'
    }))
    .pipe(gulpTslint.report());
});

gulp.task('tslint-negative', function() {
  return gulp.src('spec/*.fail.ts')
    .pipe(gulpTslint({
      configuration: `./tslint.json`,
      formatter: 'verbose'
    }))
    .pipe((function() {
      var hasError = false;
      return through(function (file) {
        if (file.tslint.failureCount === 0) {
          gutil.log(
            `[${gutil.colors.cyan('gulp-tslint')}]`,
            gutil.colors.red(`error: ${file.tslint.failureCount}`),
            `(negative) ${file.relative}`);
          hasError = true;
        }
      }, function () {
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

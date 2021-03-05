const gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  babel = require('gulp-babel'),
  rename = require('gulp-rename');
module.exports = function script() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(plumber.stop())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(
      rename({
        dirname: '',
      })
    )
    .pipe(gulp.dest('src/assets/js/'));
};

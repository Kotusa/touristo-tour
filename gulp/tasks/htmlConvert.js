const gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  pug = require('gulp-pug'),
  prettyHtml = require('gulp-pretty-html'),
  notify = require('gulp-notify');

module.exports = function htmlConvert() {
  return gulp
    .src('src/pages/*.pug')
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(plumber.stop())
    .pipe(
      prettyHtml({
        indent_size: 2,
        indent_char: ' ',
        unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br'],
      })
    )
    .pipe(gulp.dest('src'));
};

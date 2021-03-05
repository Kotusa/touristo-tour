const gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  cssnano = require('gulp-cssnano'),
  autoprefixer = require('gulp-autoprefixer'),
  gcmq = require('gulp-group-css-media-queries');

module.exports = function styles() {
  return gulp
    .src('src/sass/style.scss')
    .pipe(
      plumber({
        errorHandler(err) {
          console.log(err);
          this.emit('end');
        },
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        noCache: true,
        outputStyle: 'compressed',
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: false,
      })
    )
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('src/css'));
};

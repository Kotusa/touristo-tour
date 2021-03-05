const gulp = require('gulp');
module.exports = function images() {
  return gulp
    .src(['src/img/**/*', '!src/img/svg/*.svg'])
    .pipe(gulp.dest('dist/img/'));
};

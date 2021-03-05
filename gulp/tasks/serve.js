const gulp = require('gulp'),
  sprite = require('./sprite'),
  styles = require('./styles'),
  htmlConvert = require('./htmlConvert'),
  server = require('browser-sync').create();

module.exports = function serve(done) {
  server.init({
    server: 'src',
    notify: false,
    open: true,
    cors: true,
  });
  gulp
    .watch('src/pages/**/*.pug', gulp.series(htmlConvert))
    .on('change', server.reload);
  gulp.watch('src/*.html').on('change', server.reload);
  gulp.watch('src/js/*.js').on('change', server.reload);
  gulp
    .watch('src/img/svg/*.svg', gulp.series(sprite))
    .on('change', server.reload);
  gulp.watch(
    'src/sass/**/*.scss',
    gulp.series(styles, done =>
      gulp.src('src/css').pipe(server.stream()).on('end', done)
    )
  );
  return done();
};

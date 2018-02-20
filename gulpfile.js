const gulp = require("gulp");
const minify = require("uglify");
const log = require('fancy-log')
gulp.task('default', () => {
  log('GULPING PROJECT')
})

gulp.task('move client files', ['default'], () => {
  gulp.src('./src/source/assets/client/*.js')
  .pipe(minify())
  .pipe(gulp.dest('./src/source/assets/client/'))

  gulp.src('./src/source/assets/client/*')
  .pipe(dest('./lib/client'))
})

gulp.task('move external assets', ['default'], () => {
  log('Moving JQuery')
  gulp.src('./src/external/jquery/jquery-3.3.1.min.js')
  .pipe(dest('./lib/external'))

  log('Moving Socket.IO')
  gulp.src('./src/external/socket.io/socket.io.js')
  .pipe(dest('./lib/external'))
})

gulp.task('move main app', ['default'], () => {
  log('Minifying main file')
  gulp.src('./src/source/server.js')
  .pipe(minify())
  .pipe(dest('./lib'))
})
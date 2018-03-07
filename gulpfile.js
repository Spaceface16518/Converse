const gulp = require("gulp");
const log = require("fancy-log");
gulp.task("default", () => {
  log("GULPING PROJECT");

  gulp.src("./src/source/assets/client/*").pipe(gulp.dest("./lib"));
  gulp.src("./src/source/server.js").pipe(gulp.dest("./lib"));

  log('Moving favicons');
  gulp.src('./src/source/assets/pics/**/*').pipe(gulp.dest('./lib'))
});

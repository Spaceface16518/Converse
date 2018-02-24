const gulp = require("gulp");
const log = require("fancy-log");
gulp.task("default", () => {
  log("GULPING PROJECT");

  gulp.src("./src/source/assets/client/*").pipe(gulp.dest("./lib"));

  log("Moving JQuery");
  gulp.src("./src/external/jquery/jquery-3.3.1.min.js").pipe(gulp.dest("./lib"));

  log("Moving Socket.IO");
  gulp.src("./src/external/socket.io/socket.io.js").pipe(gulp.dest("./lib"));
  gulp.src("./src/source/server.js").pipe(gulp.dest("./lib"));

  log('Moving favicons');
  gulp.src('./src/source/assets/pics/*').pipe(gulp.dest('./lib'))
});

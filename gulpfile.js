//Add modules of gulp
const gulp = require("gulp"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync").create(),
  del = require("del");

// Add modules of gulp-css
const scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer");

//Functions
//Task html
function html() {
  return (
    gulp
      .src("src/*.html")
      // Выгрузка скомпилированного html в dist/
      .pipe(gulp.dest("dist/"))
      .pipe(browserSync.stream())
  );
}
//Task style
function styles() {
  // Choose file scss
  return (
    gulp
      .src("src/assets/sass/style.scss")
      // Sourcemaps execution start (the ability to see an error in the src file)
      .pipe(sourcemaps.init())
      // Compilation scss to css
      .pipe(
        scss({
          errorLogToConsole: true,
          outputStyle: "compressed"
        })
      )
      // Watching errors in console
      .on("error", console.error.bind(console))
      // Add auto prefixes
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["> 0.1%"],
          cascade: false
        })
      )
      // Rename file
      .pipe(rename({ suffix: ".min" }))
      // Sourcemap end
      .pipe(sourcemaps.write())
      // Unload Compiled src/css to dist/css
      .pipe(gulp.dest("dist/css"))
      // Updates the browser in case of changing scss files
      .pipe(browserSync.stream())
  );
}

// Copy fonts
function fonts() {
  return gulp.src("src/assets/fonts/**/*").pipe(gulp.dest("dist/fonts"));
}

// Copy images
function img() {
  return gulp.src("src/assets/images/**/*.*").pipe(gulp.dest("dist/images"));
}

//Function for auto-updating files if it change
function watch() {
  // Start browserSync
  browserSync.init({
    server: {
      baseDir: "dist/"
    },
    port: 3000
  });
  // Start function converter if scss-files changes
  gulp.watch("src/assets/sass/**/*.scss", styles);
  // Upload page if html-file change
  gulp.watch("src/*.html").on("change", html);
}

function clean() {
  return del(["dist/*"]);
}

// Tasks
//Compilation files of styles and scripts separately
gulp.task("html", html);
gulp.task("styles", styles);
gulp.task("fonts", fonts);
gulp.task("img", img);
// Auto compilation file and start browserSync
gulp.task("watch", watch);
// Remove files from dist and compilation new files
gulp.task(
  "dist",
  gulp.series(clean, gulp.parallel("html", "styles", "fonts", "img"))
);
// Remove files from dist and compilation new files + auto compilation files
gulp.task("dev", gulp.series("dist", "watch"));

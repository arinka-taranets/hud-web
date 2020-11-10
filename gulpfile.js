var gulp = require("gulp");
var concat = require("gulp-concat");
var cleanCSS = require("gulp-clean-css");
var autoPrefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");

// Static Server + watching scss/html files
function serve() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
    buildSass();
    gulp.watch("scss/**/*.scss", buildSass);
    gulp.watch("*.html").on("change", browserSync.reload);
    gulp.watch("*.js").on("change", browserSync.reload);
}

// Compile sass into CSS & auto-inject into browsers
function buildSass() {
    return gulp
        .src("scss/main.scss")
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("main.css"))
        .pipe(
            autoPrefixer({
                cascade: false,
            })
        )
        .pipe(
            cleanCSS({
                level: 2,
            })
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
}

// exports.build = build;
exports.default = serve;

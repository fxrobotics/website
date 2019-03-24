const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const ignore = require('gulp-ignore');
const minify = require('gulp-minify');

gulp.task("watchLog", function () {
  console.log("Changes detected. Running gulp build.");
});

const html = () => gulp.src('./*.html')
  .pipe(htmlmin({collapseWhitespace: true, removeComments:true}))
  .pipe(gulp.dest('./dist/'));

const styles = () => gulp.src('./assets/css/*.css')
  .pipe(cleanCSS({debug: true, level: {1: {specialComments: 0}}}, (details) => {
    console.log(`${details.name}: ${details.stats.originalSize}`);
    console.log(`${details.name}: ${details.stats.minifiedSize}`);
  }))
  // .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('./dist/assets/css/'));

const files = [
  'assets/js/custom.js',
  'assets/js/gmap.js'
];

const min = () => gulp.src(['./assets/js/*.js'])
  .pipe(ignore.exclude([ "**/*.map", ...files ]))
  .pipe(minify({
    ext: {
      src: '-debug.js',
      min: '.js'
    }
  }))
  // .pipe(concat("app.min.js"))
  .pipe(gulp.dest('./dist/assets/js/'));

const copyAll = () => gulp.src(['./assets/**']).pipe(gulp.dest('dist/assets/'));
const copyOther = () => gulp.src(['./*.xml', './*.txt', './*.ico']).pipe(gulp.dest('./dist/'));

gulp.task("watcher", function () {
  gulp.watch(
    ["./assets/css/*.css"], gulp.series(styles));
  gulp.watch(
    ["./assets/js/*.js"], gulp.series(min, main));
  // gulp.watch(
  //   ["./*.html"], gulp.series("upload"));
});

const main = () => gulp.src(files)
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/'));

const build = gulp.series(copyAll, html, copyOther, styles, min);
gulp.task('default', build);

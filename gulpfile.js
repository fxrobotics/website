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

const styles = () => gulp.src('./css/*.css')
  .pipe(cleanCSS({debug: true, level: {1: {specialComments: 0}}}, (details) => {
    console.log(`${details.name}: ${details.stats.originalSize}`);
    console.log(`${details.name}: ${details.stats.minifiedSize}`);
  }))
  // .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('./dist/css/'));

const min = () => gulp.src(['./js/*.js'])
  .pipe(ignore.exclude([ "**/*.map", './js/custom/**' ]))
  .pipe(minify({
    ext: {
      src: '-debug.js',
      min: '.js'
    }
  }))
  // .pipe(concat("app.min.js"))
  .pipe(gulp.dest('./dist/js/'));

const copyAll = () => gulp.src(['./img/**']).pipe(gulp.dest('dist/img/'));
const copyFonts = () => gulp.src(['./fonts/**']).pipe(gulp.dest('dist/fonts/'));
const copyOther = () => gulp.src(['./*.xml', './*.txt', './*.ico', './*.png']).pipe(gulp.dest('./dist/'));

gulp.task("watcher", function () {
  gulp.watch(
    ["./css/*.css"], gulp.series(styles));
  gulp.watch(
    ["./js/*.js"], gulp.series(min, main));
  gulp.watch(
    ["./*.html"], gulp.series(html));
});

const main = () => gulp.src(['./js/custom/**'])
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/custom/'));

const build = gulp.series(copyAll, copyFonts, html, copyOther, styles, min, main);
gulp.task('default', build);

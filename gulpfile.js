var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var bs = require('browser-sync').create();

gulp.task('scripts', function() {
  gulp.src('js/*.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(rename('app.min.js'))
      .pipe(gulp.dest('dist/'));
});

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(plumber())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('minCSS'))
    .pipe(bs.stream());
});

gulp.task('serve',['minify-css'], function() {

  bs.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('js/*.js', ['scripts']);
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('./*.html').on('change', bs.reload);
});

gulp.task('browser-sync', function() {
  bs.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('default', ['scripts', 'minify-css', 'serve']);

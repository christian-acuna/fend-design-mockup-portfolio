var gulp         = require('gulp');
var rename       = require('gulp-rename');
var cleanCSS     = require('gulp-clean-css');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var responsive = require('gulp-responsive');
var csslint = require('gulp-csslint');
csslint.addFormatter('csslint-stylish');
var del = require('del');

var bs = require('browser-sync').create();

var $ = require('gulp-load-plugins')();

gulp.task('images', ['clean:images'], function() {
  return gulp.src('images_src/*.{jpg,png}')
    .pipe($.responsive({
      // Convert all images to JPEG format
      '*': [{
        width: 1000,
        rename: {
          extname: '.jpg',
        },
      }, {
        // Produce 2x images and rename them
        width: 1000 * 2,
        rename: {
          suffix: '@2x',
          extname: '.jpg',
        },
      }],
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('clean:images', function() {
  return del(['dist/images/**/*']);
});

gulp.task('scripts', function() {
  gulp.src('src/js/*.js')
      .pipe($.plumber())
      .pipe($.uglify())
      .pipe($.rename('app.min.js'))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function() {
  gulp.src('src/css/style.css')
    .pipe(csslint({
    'shorthand': false
  }))
  .pipe(csslint.formatter('stylish'));
});

gulp.task('autoprefixer', function() {
  return gulp.src('src/*.css')
    // .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer({browsers: ['last 2 versions']})]))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-css', function() {
  return gulp.src('src/css/*.css')
    .pipe($.plumber())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
});

gulp.task('serve',['minify-css'], function() {

  bs.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/css/*.css', ['minify-css']);
  gulp.watch('./*.html').on('change', bs.reload);
});

gulp.task('browser-sync', function() {
  bs.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('default', ['scripts', 'css', 'minify-css', 'serve']);

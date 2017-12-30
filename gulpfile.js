//déclaration des variables pour les tasks

var gulp = require('gulp');
var babel = require("gulp-babel");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var cleanCss = require('gulp-clean-css');
var htmlMin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');

//déclaration des tasks

gulp.task('sassification', function(){
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    .pipe(rename(function(path){path.basename += ".min";}))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('refresh', function(){
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
});

gulp.task('uglification', function() {
  return gulp.src('./src/js/*.js')
    .pipe(babel({ presets: ['es2015']}))
    .pipe(rename(function(path){path.basename += ".min";}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

  //pour lancer automatiquement la sassification
gulp.task('watch', ['sassification', 'minify', 'refresh', 'uglification'], function(){
  gulp.watch('./src/sass/**/*.scss', ['sassification']);
  gulp.watch('./src/*.html', ['minify']);
  gulp.watch('./src/js/*.js', ['uglification']);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
  gulp.watch('./dist/css/*.css').on('change', browserSync.reload);
  gulp.watch('./dist/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['watch'], function(){
  gulp.src('./src/img/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest('./dist/img'));
});

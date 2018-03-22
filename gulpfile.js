var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('gulp-webpack');
var cssmin = require('gulp-minify-css');
var brfs = require('gulp-brfs');

var del = require('del');

var paths = {
    scripts: ['main.js', 'js/**/*.js', 'js/*.js'],
    html: ['index.html'],
    css: ['css/**/*.css', 'css/*.css'],
    fonts: ['webfonts/*']
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(brfs())
        .pipe(webpack(require('./webpack.config')))
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));
});

gulp.task('html', ['clean'], function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('build'));
});

gulp.task('fonts', ['clean'], function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('build/webfonts'));
});

gulp.task('css', ['clean'], function () {
    return gulp.src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(concat('all.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.css, ['css']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'html', 'css', 'fonts']);
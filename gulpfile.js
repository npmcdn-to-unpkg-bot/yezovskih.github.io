const gulp = require('gulp'),
        clean = require('gulp-clean'),
        sourcemaps = require('gulp-sourcemaps'),
        concat = require('gulp-concat'),
        uglify = require("gulp-uglify"),
        autoprefixer = require('gulp-autoprefixer'),
        minifyCss = require('gulp-clean-css')
        flatten = require('gulp-flatten'),
        htmlmin = require('gulp-htmlmin');

gulp.task('default', ['styles', 'html', 'js']);

gulp.task('styles', ['styles:clean'], function() {
    return gulp.src('frontend/styles/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('styles.css'))
        .pipe(autoprefixer())
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest('public/assets/styles'));
});

gulp.task('js', ['js:clean'],function() {
    return gulp.src(['frontend/app.js','frontend/services/*.js', 'frontend/directives/**/*.js', 'frontend/controllers/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('sourcemaps'))
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('html:patrials', function() {
    return gulp.src('frontend/directives/**/*.html')
        .pipe(flatten())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('public/assets/partials'));
});

gulp.task('html:index', function() {
    return gulp.src('frontend/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./'));
});

gulp.task('html', ['html:clean', 'html:index', 'html:patrials']);

gulp.task('js:clean', function() {
    return gulp.src(['public/js/*.js', 'public/js/sourcemaps'])
        .pipe(clean());
});

gulp.task('styles:clean', function() {
    return gulp.src(['public/styles/basic.css', 'public/styles/sourcemaps'])
        .pipe(clean());
});

gulp.task('html:clean', function() {
    return gulp.src(['public/styles/partials', './index.html'])
        .pipe(clean());
});




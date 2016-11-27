var gulp = require('gulp'),
gutil = require('gulp-util'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
browserify = require('gulp-browserify'),
compass = require('gulp-compass'),
connect = require('gulp-connect');

var coffeeSources = ['components/coffee/*.coffee'];
var jsSources = [
    "components/scripts/rclick.js",
    "components/scripts/pixgrid.js",
    "components/scripts/tagline.js",
    "components/scripts/template.js"
];

var sassSources = ["components/sass/style.scss"];
var htmlSources = ["builds/development/*.html"];
var jsonSources = ["builds/development/js/*.json"];

gulp.task('coffee', function(){
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('jsConcat', function(){
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            css: 'builds/development/css',
            image: 'builds/development/images',
            style: 'expanded'
        }))
        .on('error', gutil.log)
        .pipe(connect.reload());
});

gulp.task('html', function(){
    gulp.src(htmlSources)
    .pipe(connect.reload());
});

gulp.task('json', function(){
    gulp.src(jsonSources)
    .pipe(connect.reload());
})

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['jsConcat']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function(){
    connect.server({
        root: 'builds/development/',
        livereload: true
    })
})

gulp.task('default', ['coffee','jsConcat', 'compass','html', 'json', 'connect', 'watch']);
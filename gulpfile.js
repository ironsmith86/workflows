var gulp = require('gulp'),
gutil = require('gulp-util'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
browserify = require('gulp-browserify'),
compass = require('gulp-compass'),
connect = require('gulp-connect');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env == 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = [
    "components/scripts/rclick.js",
    "components/scripts/pixgrid.js",
    "components/scripts/tagline.js",
    "components/scripts/template.js"
];

sassSources = ["components/sass/style.scss"];
htmlSources = [ outputDir + "*.html"];
jsonSources = [ outputDir + "js/*.json"];

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
        .pipe(gulp.dest( outputDir + 'js'))
        .pipe(connect.reload());
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            css: outputDir + 'css',
            image: outputDir + 'images',
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
        root: outputDir,
        livereload: true
    })
})

gulp.task('default', ['coffee','jsConcat', 'compass','html', 'json', 'connect', 'watch']);
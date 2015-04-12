var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    debug = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    mocha = require('gulp-mocha'),
    react = require('gulp-react'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    //webpack = require('gulp-webpack'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    runSequence = require('run-sequence');


var paths = {
    dist: {
        root: 'dist',
        all: 'dist/**/*'
    },
    src: {
        root: 'src',
        entry: 'src/main.es6',
        all: 'src/**/*',
        lib: 'src/lib/**/*',
        style: 'src/styles/*',
        image: 'src/image/**/*',
        html: 'src/*.html'
    }
}


gulp.task('clean', function(cb) {
    del([
        paths.dist.all,
        '!.gitignore'
    ], cb);
});


gulp.task('move:html', function() {
    gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.dist.root));
});


gulp.task('move', ['move:html'])


// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function(callback) {

    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });

});


gulp.task('webpack:build-prod', function(callback) {

    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });

});


gulp.task('test', function() {

});


gulp.task('serve', function() {
    connect.server({
        root: 'dist',
        port: 8765
    });
});


gulp.task('watch', function() {
    gulp.watch([paths.src.all], ["webpack:build-dev"]);
});


gulp.task('prod', function() {
    runSequence('clean',
                'move',
                'webpack:build-prod',
                'serve');
});


gulp.task('default', function() {
    runSequence('clean',
                'move',
                'webpack:build-dev',
                'serve',
                'watch');
});
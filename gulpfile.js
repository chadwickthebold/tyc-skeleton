var gulp = require('gulp'),
    gutil = require('gulp-util'),
    del = require('del'),
    connect = require('gulp-connect'),
    debug = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    webpackConfigTest = require('./test/webpack.config.test.js'),
    runSequence = require('run-sequence');


var paths = {
    dist: {
        root: 'dist',
        all: 'dist/**/*'
    },
    src: {
        root: 'src',
        entry: 'src/main.jsx',
        all: 'src/**/*',
        lib: 'src/lib/**/*',
        style: 'src/styles/*',
        image: 'src/image/**/*',
        html: 'src/*.html',
        js: 'src/js/**/*.{js,es6}',
        jsx: 'src/js/**/*.jsx'
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


gulp.task('move', ['move:html']);


gulp.task('hint:jsx', function() {
    return gulp.src([paths.src.jsx, paths.src.entry])
        .pipe(jshint({ linter: require('jshint-jsx').JSXHINT }))
        .pipe(jshint.reporter('default'));
});

gulp.task('hint:js', function() {
    return gulp.src(paths.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('hint', ['hint:jsx', 'hint:js']);


// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', ['hint'], function(callback) {

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


gulp.task('webpack:build-test', function(callback) {
    var myTestConfig = Object.create(webpackConfigTest);
    myDevConfig.devtool = "sourcemap";
    myDevConfig.debug = true;

    var testCompiler = webpack(myTestConfig);

    testCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-test]", stats.toString({
            colors: true
        }));
        callback();
    });

});


gulp.task('test', function() {
    runSequence('hint',
                'webpack:build-test',
                'serve:test',
                'watch:test');

});


gulp.task('serve:test', function() {
    connect.server({
        root: 'test',
        port: 8567
    })
});


gulp.task('serve:dist', function() {
    connect.server({
        root: 'dist',
        port: 8765
    });
});


gulp.task('watch:test', function() {
    gulp.watch([paths.src.all], ["webpack:build-test"])
});


gulp.task('watch:dev', function() {
    gulp.watch([paths.src.all], ["webpack:build-dev"]);
});


gulp.task('prod', function() {
    runSequence('clean',
                'move',
                'hint',
                'webpack:build-prod',
                'serve:dist');
});


gulp.task('default', function() {
    runSequence('clean',
                'move',
                'webpack:build-dev',
                'serve:dist',
                'watch:dev');
});
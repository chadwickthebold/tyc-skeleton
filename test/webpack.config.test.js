var path = require('path'),
    webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  cache: true,
  debug: true,
  entry: {
    test: 'mocha!./test/all.spec.js'
  },
  output: {
    path: __dirname + '',
    filename: 'testBundle.js'
  },
  module: {
    loaders: [
      // CSS + Less
      // Extract css files
      {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      // Optionally extract less files
      // or any other compile-to-css language
      {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },

      // React (JSX) + ES6
      { test: /\.(es6|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'},

    ],
    noParse: /\.min\.js/
  },
  resolve: {
    modulesDirectories: ['bower_components', 'node_modules'],
    extensions: ['', '.js', '.es6', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new webpack.ResolverPlugin([
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ], ["normal", "loader"])
  ]
};
/* eslint-disable new-cap */
// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//   entry: './js',
//   output: {
//     filename: 'app.bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   devtool: 'source-map',
//   module: {
//     rules: [
//       { enforce: 'pre', test: /\.js$/, loader: 'eslint-loader' },
//       {
//         test: /\.js$/,
//         exclude: /(node_modules)/,
//         use: {
//           loader: 'babel-loader',
//         },
//       },
//       {
//         test: /\.css$/,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
//   plugins: [new HtmlWebpackPlugin()],
// };

// // const ConcatPlugin = require('webpack-concat-plugin');

// // new ConcatPlugin({
// //   // examples
// //   uglify: false,
// //   sourceMap: false,
// //   name: 'piskel-clone',
// //   outputPath: path.resolve(__dirname, 'dist'),
// //   fileName: '[name].[hash:8].js',
// //   filesToConcat: [ './js/**', './*.js'],
// //   attributes: {
// //     async: true
// //   }
// // });
const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './js/script.js',
  output: {
    library: 'UserList',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new uglifyJsPlugin(),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

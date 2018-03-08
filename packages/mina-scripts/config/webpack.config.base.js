const webpack = require('webpack')
const path = require('path')
const MinaEntryPlugin = require('@tinajs/mina-entry-webpack-plugin')
const MinaRuntimePlugin = require('@tinajs/mina-runtime-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const resolveCwd = path.resolve.bind(null, process.cwd())
const srcDir = resolveCwd('src')
const distDir = resolveCwd('dist')

module.exports = {
  context: srcDir,
  entry: 'app.mina',
  output: {
    path: distDir,
    filename: '[name]',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.mina$/,
        include: srcDir,
        use: {
          loader: '@tinajs/mina-loader',
          options: {
            loaders: {
              script: 'babel-loader',
              style: 'postcss-loader',
            },
          },
        },
      },
      {
        test: /\.mina$/,
        include: /node_modules/,
        use: '@tinajs/mina-loader',
      },
      // wxml/js 中的静态资源引用
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        include: srcDir,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[hash:6].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    // wxml-loader 不能处理的动态资源引用（wxss 暂由 postcss-import 处理）
    // @see https://github.com/Cap32/wxml-loader/issues/1
    new CopyWebpackPlugin(['project.config.json'], {
      context: srcDir,
    }),
    new MinaEntryPlugin(),
    new MinaRuntimePlugin({
      runtime: './common.js',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common.js',
      minChunks: 2,
    }),
    isProduction && new UglifyJsPlugin(),
  ].filter(Boolean),
}
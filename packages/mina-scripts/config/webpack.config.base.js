const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MinaEntryPlugin = require('@tinajs/mina-entry-webpack-plugin')
const MinaRuntimePlugin = require('@tinajs/mina-runtime-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {ESBuildPlugin, ESBuildMinifyPlugin} = require('esbuild-loader')

const {NODE_ENV} = process.env
const isProduction = NODE_ENV === 'production'
const resolveCwd = path.resolve.bind(null, process.cwd())
const srcDir = resolveCwd('src')
const distDir = resolveCwd('dist')

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  `.env.${NODE_ENV}`,
  '.env',
].filter(Boolean)

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(require('dotenv').config({path: dotenvFile}))
  }
})

const envKeys = Object.keys(process.env)
  .filter((key) => /^APP_/i.test(key))
  .reduce(
    (env, key) => {
      env[key] = process.env[key]
      return env
    },
    {NODE_ENV}
  )

const scriptLoader = {
  loader: 'esbuild-loader',
  options: {target: 'es2015'},
}

module.exports = {
  context: srcDir,
  // issue: https://github.com/tinajs/mina-webpack/issues/12
  parallelism: 999,
  entry: 'app.mina',
  output: {
    path: distDir,
    filename: '[name]',
    publicPath: '/',
    globalObject: 'wx',
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
              script: scriptLoader,
              style: 'postcss-loader',
            },
          },
        },
      },
      {
        test: /\.mina$/,
        // node_modules or linked packages
        exclude: srcDir,
        use: {
          loader: '@tinajs/mina-loader',
          options: {
            loaders: {
              script: scriptLoader,
            },
          },
        },
      },
      // babel 转换，以匹配 browserslist
      {
        test: /\.js$/,
        use: scriptLoader,
      },
      // wxml/js 中的静态资源引用
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[hash:6].[ext]',
          },
        },
      },
      {
        test: /\.wxs$/,
        use: {
          loader: 'relative-file-loader',
          options: {
            name: 'assets/[name].[hash:6].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new ESBuildPlugin(),
    new webpack.EnvironmentPlugin(envKeys),
    // wxml-loader 不能处理的动态资源引用（wxss 暂由 postcss-import 处理）
    // @see https://github.com/Cap32/wxml-loader/issues/1
    new CopyWebpackPlugin(['project.config.json'], {
      context: srcDir,
    }),
    new MinaEntryPlugin(),
    new MinaRuntimePlugin(),
  ].filter(Boolean),
  optimization: {
    ...(isProduction && {
      minimize: true,
      minimizer: [
        new ESBuildMinifyPlugin({target: scriptLoader.options.target}),
      ],
    }),
    splitChunks: {
      chunks: 'all',
      name: 'common.js',
      minChunks: 2,
      minSize: 0,
    },
    runtimeChunk: {
      name: 'runtime.js',
    },
  },
  mode: isProduction ? 'production' : 'none',
}

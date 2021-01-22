process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const emptyDir = require('./utils/emptyDir')
const resolveConfig = require('./utils/resolveConfig')

const build = async () => {
  await emptyDir()

  const config = resolveConfig()
  const compiler = webpack(config.webpack)

  compiler.run((err) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

module.exports = build

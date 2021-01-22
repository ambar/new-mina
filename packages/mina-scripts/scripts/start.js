process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const emptyDir = require('./utils/emptyDir')
const resolveConfig = require('./utils/resolveConfig')

const start = async () => {
  await emptyDir()

  const config = resolveConfig()
  const compiler = webpack(config.webpack)

  const watching = compiler.watch({}, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }
  })
}

module.exports = start

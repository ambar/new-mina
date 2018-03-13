process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const emptyDir = require('./utils/emptyDir')
const resolveConfig = require('./utils/resolveConfig')

const start = async () => {
  console.info('starting')
  await emptyDir()

  const cwd = process.cwd()
  const config = resolveConfig()
  const compiler = webpack(config.webpack)

  const watching = compiler.watch({}, (err, stats) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(
      stats.toString({
        colors: true,
        children: false,
        chunks: false,
      })
    )
  })
}

module.exports = start

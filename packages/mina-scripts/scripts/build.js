process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const emptyDir = require('./utils/emptyDir')
const resolveConfig = require('./utils/resolveConfig')

const build = async () => {
  console.info('building')
  await emptyDir()

  const config = resolveConfig()
  const compiler = webpack(config.webpack)

  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(
      stats.toString({
        colors: true,
      })
    )
  })
}

module.exports = build

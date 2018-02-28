process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const resolveConfig = require('./utils/resolveConfig')

const build = () => {
  console.info('building')
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

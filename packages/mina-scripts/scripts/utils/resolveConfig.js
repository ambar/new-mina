const resolveConfig = () => {
  const baseConfig = require('../../config/webpack.config.base')
  return {webpack: baseConfig}
}

module.exports = resolveConfig

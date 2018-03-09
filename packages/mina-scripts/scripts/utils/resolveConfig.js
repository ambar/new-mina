const fs = require('fs')
const path = require('path')
const {mergeWith, partialRight} = require('lodash')

const deepMerge = partialRight(mergeWith, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

const loadUserConfig = () => {
  const configFile = path.resolve(process.cwd(), 'mina.config.js')
  if (fs.existsSync(configFile)) {
    return require(configFile)
  }

  return null
}

const resolveConfig = () => {
  let baseConfig = {
    webpack: require('../../config/webpack.config.base'),
  }

  const userConfig = loadUserConfig() || {}

  if (typeof userConfig.overrides === 'function') {
    baseConfig = userConfig.overrides(baseConfig)
  }

  return deepMerge(baseConfig, userConfig)
}

module.exports = resolveConfig

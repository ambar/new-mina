const {promisify} = require('util')
const rimraf = require('rimraf')

const emptyDir = async () => {
  await promisify(rimraf)('./dist/!(app.json|project.config.js)**')
}

module.exports = emptyDir

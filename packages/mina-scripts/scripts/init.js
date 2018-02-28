const fs = require('fs-extra')
const path = require('path')
const {exec} = require('child_process')
const {promisify} = require('util')
const execP = promisify(exec)

const resolveCwd = path.resolve.bind(null, process.cwd())
const resolveRelative = path.resolve.bind(null, __dirname)

const init = async () => {
  const templateDir = resolveRelative('../templates/js')
  fs.copySync(templateDir, process.cwd())

  // use lodash template?
  const pkg = require(resolveCwd('package.json'))
  const name = pkg.name
  const projectConfigFile = resolveCwd('src/project.config.json')
  const projectConfig = Object.assign({}, require(projectConfigFile), {
    projectname: name,
  })
  fs.writeFileSync(projectConfigFile, JSON.stringify(projectConfig, null, '  '))
}

module.exports = init

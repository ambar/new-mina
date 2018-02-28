const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const log = require('fancy-log')

const resolveCwd = path.resolve.bind(null, process.cwd())

const execP = (cmd, options) =>
  execa.shell(cmd, Object.assign({stdio: 'inherit'}, options))

const pkgTemplate = {
  name: '',
  private: true,
  scripts: {
    start: 'mina start',
    build: 'mina build',
  },
}

const npx = (cmd, cwd) => execP(`npx ${cmd}`, {cwd})
const npm = (cmd, cwd) => execP(`npm ${cmd}`, {cwd})
const yarn = (cmd, cwd) => execP(`yarn ${cmd}`, {cwd})

const install = async (appName, options = {}) => {
  if (!appName) {
    throw new Error('Requires app name')
  }

  const appDir = resolveCwd(appName)
  if (fs.existsSync(appDir)) {
    throw new Error('Directory exists')
  }

  log(`Creating app directory: ${chalk.green(appDir)}`)
  fs.mkdirSync(appName)
  fs.writeFileSync(
    appDir + '/package.json',
    JSON.stringify(Object.assign({}, pkgTemplate, {name: appName}), null, '  ')
  )

  const useYarn = options.yarn || /yarn/.test(process.env.npm_execpath)
  const script = options.script
  log('Installing scripts...')
  if (useYarn) {
    await yarn(`add ${script} --D`, appDir)
    await yarn(`mina init`, appDir)
  } else {
    await npm(`install ${script} --D`, appDir)
    await npx(`mina init`, appDir)
  }
}

const createApp = async (appName, options) => {
  try {
    await install(appName, options)
  } catch (e) {
    log.error(e)
  }
}

module.exports = createApp

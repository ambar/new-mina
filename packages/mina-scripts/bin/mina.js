#!/usr/bin/env node

const yargs = require('yargs')
const usage = 'npx mina [command]'

yargs
  .usage(usage)
  .command('build', 'Build app for production', yargs => {
    const build = require('../scripts/build')
    build()
  })
  .command('start', 'Start app for development', yargs => {
    const start = require('../scripts/start')
    start()
  })
  .help('h')

const argv = yargs.argv
const [command] = argv._
if (command === 'init') {
  // 隐藏命令，仅用于初始化项目
  const init = require('../scripts/init')
  init()
} else if (!command) {
  yargs.showHelp()
}

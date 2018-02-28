#!/usr/bin/env node
const yargs = require('yargs')
const createApp = require('../src/createApp')
const pkg = require('../package.json')

yargs
  .usage(`npx ${pkg.name} [appName]`)
  .option('yarn', {
    alias: 'y',
    type: 'boolean',
    default: false,
    describe: 'Use Yarn',
  })
  .option('script', {
    type: 'string',
    default: 'mina-scripts',
    describe: 'Script repository',
  })
  .help('h')

const argv = yargs.argv
const appName = argv._[0]
if (appName) {
  createApp(appName, argv)
} else {
  yargs.showHelp()
}

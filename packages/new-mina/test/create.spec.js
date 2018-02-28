const path = require('path')
const globby = require('globby')
const execa = require('execa')

// async timeout
jest.setTimeout(100000)

const resolveRelative = path.resolve.bind(null, __dirname)
const execP = (cmd, options) =>
  execa.shell(cmd, Object.assign({stdio: 'inherit'}, options))

describe('create', () => {
  beforeEach(() => {
    process.chdir(__dirname)
  })

  it('should add new app', async () => {
    const appName = `my-app`
    const appDir = resolveRelative(appName)

    await execP(`rm -rf ${appName}`)
    const script = `file:${resolveRelative('../../mina-scripts')}`
    await execP(`node ../bin/new-mina --script ${script} ${appName}`)

    process.chdir(appDir)
    const getAppfiles = () => globby(`**/*.*`, {gitignore: true})
    const getDistfiles = () => globby(`dist/**/*.*`)
    expect(await getAppfiles()).toMatchSnapshot()

    await execP(`npm run build`)
    expect(await getDistfiles()).toMatchSnapshot()
  })
})

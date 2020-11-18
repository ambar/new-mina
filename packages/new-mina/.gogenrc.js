module.exports = async (
  {src, dest, pipeline, packages},
  {name, install, gitInit, argv}
) => {
  await pipeline(
    src('template/**'),
    packages({name}),
    dest()
  )
  await install([argv.script || 'mina-scripts'], {dev: true})
  await gitInit()
}

// var log = gaston.log.make('config')

module.exports = function findPackage () {
  var cwd = process.cwd()
  var folders = cwd.split('/')
  var pckg

  while (folders.length) {
    var path = folders.join('/') + '/pckg.json'
    try {
      pckg = require(path)
      break
    } catch (err) {}
    folders.pop()
  }

  return pckg
}

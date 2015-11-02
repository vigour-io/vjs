'use strict'

var path = require('path')

module.exports = function findPackage (pkgPath) {
  if (!pkgPath) {
    pkgPath = process.cwd() // other option: require.main.filename
  }

  pkgPath += '/package.json'
  var lastPath
  var pkg

  while (pkgPath !== lastPath) {
    lastPath = pkgPath
    try {
      pkg = {
        obj: require(pkgPath),
        dir: path.resolve(pkgPath, '..')
      }
      break
    } catch (err) {}

    pkgPath = path.resolve(pkgPath, '../../package.json')
  }

  return pkg
}

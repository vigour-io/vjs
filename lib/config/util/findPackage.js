'use strict'

var path = require('path')

// var log = gaston.log.make('config')

module.exports = function findPackage (start) {
  var folders = start.split('/')
  var pckg

  while (folders.length) {
    var pth = path.join(folders.join('/'), 'package.json')
    try {
      pckg = require(pth)
      break
    } catch (err) {

    }
    folders.pop()
  }

  return pckg
}

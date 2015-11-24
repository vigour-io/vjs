'use strict'

module.exports = function findPackage () {
  try {
  	var pkg = require('package.json')
  	// console.log('got dat package', pkg)
    return pkg
  } catch (err) {
    console.error('failed to find package.json!')
  }
}

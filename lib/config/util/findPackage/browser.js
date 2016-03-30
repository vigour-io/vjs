'use strict'

module.exports = function findPackage () {
  try {
    return require('package.json')
  } catch (err) {
    console.error('failed to find package.json!')
  }
}

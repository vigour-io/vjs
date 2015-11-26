'use strict'
var Base = require('../../base')
var isStream = require('./stream')

module.exports = function isPlainObj (obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !(Base && (obj instanceof Base)) &&
    !(obj instanceof Buffer) &&
    !(isStream(obj))
  )
}

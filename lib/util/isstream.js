'use strict'
var stream = require('stream')
var Duplex = stream.Duplex
var Readable = stream.Readable
var Writable = stream.Writable

module.exports = exports = function (val) {
  return val && (
    val instanceof Duplex ||
    val instanceof Readable ||
    val instanceof Writable
  )
}

exports.readable = function (val) {
  return val && (
    val instanceof Duplex ||
    val instanceof Readable
  )
}

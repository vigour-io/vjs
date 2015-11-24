'use strict'
var Base = require('../../base')
module.exports = function (obj) {
  var referenced = obj._input
  if (referenced &&
    referenced instanceof Base &&
    referenced._input !== null) {
    return referenced
  }
}

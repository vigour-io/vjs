'use strict'
var Base = require('../base')
module.exports = function (obj) {
  var referenced = obj._input
  return referenced && referenced instanceof Base && referenced
}

'use strict'
var getDepth = require('../get/depth')
var getLevel = require('../get/level')
module.exports = function (current, id) {
  var depth = getDepth(current)
  var level = getLevel(current)
  return (((level << 8) | depth) << 16) | id
}

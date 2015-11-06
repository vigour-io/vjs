'use strict'
var getDepth = require('../get/depth')
var getLevel = require('../get/level')
// TODO: clean this up
module.exports = function (current) {
  var depth = getDepth(current) + 1
  var level = getLevel(current)
  current &= 0xffff
  return (current |= ((level << 8) | depth) << 16)
}

'use strict'
var getDepth = require('../get/depth')
var getLevel = require('../get/level')
// TODO: clean this up
module.exports = function (current) {
  var depth = getDepth(current)
  var level = getLevel(current) + 1
  current &= 0xffff
  return (current |= ((level << 8) | depth) << 16)
}

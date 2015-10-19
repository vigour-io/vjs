'use strict'
// incrementing values
// TODO: clean this up
exports.incrementDepth = function (info) {
  var depth = exports.getDepth(info) + 1
  var lateral = exports.getLateral(info)
  info &= 0xffff
  info = (info |= ((lateral << 8) | depth) << 16)
  return info
}

exports.incrementLateral = function (info) {
  var depth = exports.getDepth(info)
  var lateral = exports.getLateral(info) + 1
  return (info |= ((lateral << 8) | depth) << 16)
}

exports.setId = function (info, id) {
  var depth = exports.getDepth(info)
  var lateral = exports.getLateral(info)
  return (((lateral << 8) | depth) << 16) | id
}

// getting values
exports.getDepth = function (value) {
  return (value >> 16) & 0xff
}

exports.getLateral = function (value) {
  return (value >> 24) & 0xff
}

exports.getId = function (value) {
  return value & 0xffff
}

// comparing values
exports.isCloserOrSame = function (value, info) {
  var depth = exports.getDepth(info)
  var lateral = exports.getLateral(info)
  var founddepth = exports.getDepth(value)
  if (founddepth > depth) {
    return true
  }
  if (founddepth === depth) {
    if (exports.getLateral(value) >= lateral) {
      return true
    }
  }
}
'use strict'
var Base
var isNumber = require('lodash/lang/isNumber')
var Readable = require('stream').Readable
  // making these kind of util functions
  // is a very fast way to work (they get extra optimized by v8 if used by everything)

// utils can become seperate files (cleaner)

// instanceof object is slower then typeof (15%), this goes against popular believe
// also faster then using lodash isObj (the check is not as solid but we dont support old platforms)
// it does not check for plain Obj but checks for non-vigour objects
exports.isPlainObj = function (obj) {
  return (
    typeof obj === 'object' &&
    !(Base && (obj instanceof Base)) &&
    !(obj instanceof Readable) &&
    obj !== null
  )
}

// use this when trying to convert args into an array
exports.convertToArray = function (obj, index) {
  var args = []
  for (var i = index || 0, length = obj.length; i < length; i++) {
    // args[i] = obj[i]
    args.push(obj[i])
  }
  return args
}

exports.isNumber = isNumber

exports.isNumberLike = function (val) {
  if (val === null) {
    return
  }
  var length = val.length
  if (!length) {
    return isNumber(val)
  }
  var i = 0
    // charAt is faster in v8
  if (val.charAt(0) === '-') {
    if (length === 1) {
      return
    }
    i = 1
  }
  for (; i < length; i++) {
    var c = val.charAt(i)
      // bit range is outside number range
    if (c <= '/' || c >= ':') {
      return
    }
  }
  return true
}

exports.isEmpty = function (obj) {
  var found
  if (obj.each) {
    obj.each(function (key) {
      return (found = true)
    })
  } else {
    // JSstandard: wrong warning need this here
    for (var key in obj) {
      return false
    }
  }
  return !found
}

exports.isArrayLike = function (obj) {
  var onlyNumbers = true
  for (var i in obj) {
    if (!exports.isNumberLike(i)) {
      onlyNumbers = false
      break
    }
  }
  if (onlyNumbers) {
    var keys = Object.keys(obj)
    keys.sort()
    var last = -1
    var ordered = true
    for (var j in keys) {
      if (keys[j] - last !== 1) {
        ordered = false
        break
      }
      last = keys[j]
    }
    if (!ordered) {
      // console.error(keys)
    } else {
      // this is an array
      var oldobj = obj
      obj = []
      for (var n in keys) {
        obj.push(oldobj[keys[n]])
      }
    }
  }
  // this is now a convert not an is clean up required - split up in 2 functions
  return obj
}

exports.isRemoved = function (base) {
  for (var key in base) {
    // use each for this one
    if (base.hasOwnProperty(key)) {
      // temp fix -- should become configurable
      // this thing is only used in tests however
      if (base[key] !== null &&
        key !== 'key' &&
        key !== 'lastStamp' &&
        key !== '_parent'
      ) {
        return false
      }
    }
  }
  if (base._input !== null) {
    return false
  }
  return true
}

Base = require('../base')

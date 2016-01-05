'use strict'
var getDepth = require('./current/get/depth')
var getLevel = require('./current/get/level')

module.exports = keepListener
exports.notFulfilled = notFulfilled

function keepListener (pattern, current) {
  for (var i in pattern) {
    if (i[0] !== '_' && i !== 'key') {
      if (notFulfilled(pattern[i], current)) {
        return true
      }
    }
  }
}

function notFulfilled (field, current) {
  let value = field && field._input
  if (!value) {
    return keepListener(field, current)
  }
  if (value === true) {
    return true
  }
  let prevDepth = getDepth(value)
  if (prevDepth) {
    let refDepth = getDepth(current)
    if (prevDepth > refDepth) {
      return true
    } else if (prevDepth === refDepth) {
      if (getLevel(value) > getLevel(current)) {
        return true
      }
    }
  } else if (getLevel(value) > getLevel(current)) {
    return true
  }
}

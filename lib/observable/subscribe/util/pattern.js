'use strict'
var getLateral = require('../info').getLateral
module.exports = function getPattern (obj, pattern, info, mapObj) {
  if (!getLateral(info) && !pattern._context) {
    return findPattern(obj, mapObj, [], 0)
  }
  return pattern
}

function findPattern (obj, mapObj, path, length) {
  if (mapObj === true || mapObj === 1) {
    let pattern = obj.pattern
    if (!length) {
      return pattern.upward || pattern
    }
    for (let i = length - 1; i >= 0; i--) {
      let key = path[i]
      if (key === 'sub_parent') {
        pattern = pattern.sub_parent || pattern.upward || pattern
      } else {
        pattern = pattern[key]
      }
    }
    return pattern
  }
  for (let i in mapObj) {
    let mapValue = mapObj[i]
    if (mapValue) {
      let next = obj[i]
      if (next) {
        if (i === 'parent') {
          path.push(obj.key)
        } else {
          path.push('sub_parent')
        }
        return findPattern(next, mapValue, path, ++length)
      } else {
        mapObj[i] = null
      }
    }
  }
}

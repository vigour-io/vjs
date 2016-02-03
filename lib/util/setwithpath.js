'use strict'

module.exports = function setWithPath (obj, path, val) {
  var ret = obj
  var key = path.shift()
  if (path.length === 0) {
    ret = obj[key] = val
  } else {
    obj[key] = {}
    ret = setWithPath(obj[key], path, val)
  }
  return ret
}

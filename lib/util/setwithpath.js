'use strict'

module.exports = function setWithPath (obj, path, val, i) {
  if (!i) {
    i = 0
  }
  if (path.length - 1 === i) {
    obj[path[i]] = val
  } else {
    obj[path[i]] = {}
    setWithPath(obj[path[i]], path, val, (i + 1))
  }
  return obj
}

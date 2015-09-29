'use strict'

module.exports = function setWithPath (obj, path, val, overwrite) {
  if ( val === void 0) {
    val = path
    path = obj
    obj = {}
  }
  var key
  var pathlength = path.length
  for (var p = 0, l = pathlength - 2; p <= l; p++) {
    key = path[p]
    obj = obj[key] || (obj[key] = {})
  }
  var target
  if (pathlength) {
    key = path[p]
    target = obj[key]
  } else {
    target = obj
  }

  if (
    target === void 0 ||
    overwrite === void 0 ||
    overwrite === true ||
    typeof overwrite === 'function' && overwrite(target, val)
  ) {
    obj[key] = val
  }

  return obj
}

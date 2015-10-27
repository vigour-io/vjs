'use strict'
module.exports = function getPattern (obj, mapObj, path) {
  if (mapObj === true) {
    let pattern = obj.pattern
    for (let i = path.length - 1; i >= 0; i--) {
      pattern = pattern[path[i]]
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
        return getPattern(next, mapValue, path)
      } else {
        mapObj[i] = null
      }
    }
  }
}

'use strict'
module.exports = function find (property, mapvalue) {
  if (mapvalue === true) {
    return property
  }
  for (var i in mapvalue) {
    let value = mapvalue[i]
    if (value) {
      let next = property[i]
      if (next) {
        return find(next, mapvalue)
      } else {
        mapvalue[i] = null
      }
    }
  }
}
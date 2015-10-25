'use strict'
module.exports = function emit(data, event, property, mapvalue, key, noinstances) {
  if (mapvalue === true) {
    property.emit(key, data, event)
    return property
  }
  for (var i in mapvalue) {
    let value = mapvalue[i]
    if (value) {
      let next = property[i]
      if (next) {
        return emit(data, event, next, value, key, noinstances)
      } else {
        mapvalue[i] = null
      }
    }
  }
}
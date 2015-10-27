'use strict'
module.exports = function emit (data, event, property, mapValue, key, noinstances) {
  for (var i in mapValue) {
    let value = mapValue[i]
    if (value) {
      let next = property[i]
      if (next) {
        if (value === true) {
          next.emit(key, data, event)
          mapValue[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            next.emit(key, data, event)
          }
        } else {
          emit(data, event, next, value, key, noinstances)
        }
      }
    }
  }

}

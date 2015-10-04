'use strict'
module.exports = function emit (data, event, property, mapvalue, key, noinstances) {
  var next = property
  var value
  for (var i in mapvalue) {
    value = mapvalue[i]
    if (value) {
      next = property[i]
      if (next) {
        if (value === true) {
          next.emit(key, void 0, event)
          mapvalue[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            next.emit(key, void 0, event)
          }
        } else {
          emit(data, event, next, value, key, noinstances)
        }
      } else {
        mapvalue[i] = null
      }
    }
  }
}

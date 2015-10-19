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
          next.emit(key, data, event)
          mapvalue[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            next.emit(key, data, event)
          }
        } else {
          emit(data, event, next, value, key, noinstances)
        }
      }
      // When to null this? 
      // else {
      //   mapvalue[i] = null
      // }
    }
  }
}

'use strict'

module.exports = function emit (data, event, property, mapvalue, key, noinstances) {
  for (var i in mapvalue) {
    let value = mapvalue[i]
    if (value) {
      let next = property[i]
      if (next) {
        if (value === true) {
          console.log('emit!', next)
          next.emit(key, data, event)
          mapvalue[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            console.log('instance emit!',next)
            next.emit(key, data, event)
          }
        }else {
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

module.exports = function emit(data, event, property, mapvalue, key, noinstances) {
  if (mapvalue === true) {
    console.error('emit',property.path, data.origin.val)
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
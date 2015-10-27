'use strict'
// var getLateral = require('../info').getLateral

module.exports = function onData (data, event, emitter, pattern, info, mapValue, fireSubscription) {
  if (data === null) {
    let subscriber = emitter._parent.parent
    if (subscriber._input || mapValue.parent) {
      pattern[this.key].val = true
      emitter.subscribeField(data, event, subscriber, subscriber.pattern)
    }
  }
  data = {
    prevValue: data,
    origin: this
  }

  fireSubscription(data, event)
  // if (getLateral(info) > 0) {
  //   emitter.emit(data, event, subscriber)
  // } else {
  //   emit(data, event, this, mapValue, emitter.key)
  // }
}

function emit (data, event, property, mapValue, key, noinstances) {
  if (mapValue === true) {
    property.emit(key, data, event)
    return property
  }
  for (var i in mapValue) {
    let value = mapValue[i]
    if (value) {
      let next = property[i]
      if (next) {
        return emit(data, event, next, value, key, noinstances)
      } else {
        mapValue[i] = null
      }
    }
  }
}

'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
      // check if removed
      if (data === null) {
        pattern.val = true
        emitter.findResubscribe(data, event, this, mapvalue)
      }
      // emit
      data = createData(this, data)
      // uses the map to find the subscriber(s)
      emitter.findEmit(data, event, this, mapvalue)
    },
    reference (data, event, emitter, pattern, current, mapvalue, context) {
      if (data === null) {
        pattern.val = true
        emitter.findResubscribe(data, event, context, mapvalue)
      }
      // emit
      data = createData(this, data)
        // needs some help to find the subscriber(s)
      emitter.findEmit(data, event, context, mapvalue)
    }
}

function createData (origin, data) {
  if (data && typeof data === 'object') {
    if (!data.origin) {
      data.origin = origin
    }
  } else {
    data = {
      origin: origin,
      previous: data
    }
  }
  return data
}

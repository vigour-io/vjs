'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    // check if removed
    if (data === null) {
      let subscriber = emitter._parent.parent
      if (subscriber._input || mapvalue === true || mapvalue.parent) {
        resolvePattern(this, mapvalue)
        // check out best way to resubscribe
        pattern.val = true
        emitter.subField(data, event, subscriber, subscriber.pattern, 0, true)
      }
    }
    // emit
    data = createData(this, data)
    // uses the map to find the subscriber(s)
    emitter.findEmit(data, event, this, mapvalue)
  },
  reference (data, event, emitter, pattern, current, mapvalue, context) {
    // check if removed
    if (data === null) {
      let subscriber = emitter._parent.parent
      if (subscriber._input || mapvalue === true || mapvalue.parent) {
        // resolvePattern(this, mapvalue)
        // check out best way to resubscribe
        pattern.val = true
        emitter.subField(data, event, subscriber, subscriber.pattern, 0, true)
      }
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

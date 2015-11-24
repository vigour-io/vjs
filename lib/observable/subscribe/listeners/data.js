'use strict'
// var resolvePattern = require('../resolve')
var createData = require('../createdata')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    // check if removed
    if (data === null) {
      pattern.val = true
      // emitter.findResubscribe(data, event, this, pattern, mapvalue)
    }
    // emit
    data = createData(this, data)
    // uses the map to find the subscriber(s)
    emitter.findEmit(data, event, this, mapvalue)
  },

  reference (data, event, emitter, pattern, current, mapvalue, context) {
    if (data === null) {
      pattern.val = true
      // emitter.findResubscribe(data, event, context, pattern, mapvalue)
    }
    // emit
    data = createData(this, data)
    // needs some help to find the subscriber(s)
    emitter.findEmit(data, event, context, mapvalue)
  }
}

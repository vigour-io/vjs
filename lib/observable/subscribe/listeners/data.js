'use strict'
var resolvePattern = function () {}
exports = {
  direct (data, event, emitter, pattern, mapvalue, map) {
    // uses the map to find the subscriber(s)

    // check if removed
    if (data === null) {
      resolvePattern(this, mapvalue)
      // check out best way to resubscribe
      emitter.subField()
    }
    // emit
    emitter.findEmit(data, event, this, mapvalue, map)
  },
  reference (data, event, emitter, pattern) {
    // needs some help to find the subscriber(s)

    // check if removed
    if (data === null) {

    }
    // emit
  }
}

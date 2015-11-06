'use strict'
var resolvePattern = function () {}
module.exports = {
  direct (data, event, emitter, pattern, mapvalue, map) {
    // uses the map to find the subscriber(s)

    // check if removed
    if (data === null) {
      let subscriber = emitter._parent.parent
      // resolvePattern(this, mapvalue)
      // check out best way to resubscribe
      console.log('-----remove', subscriber)
      emitter.subField(data, event, subscriber, subscriber.pattern, 0, true)
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

'use strict'
var resolvePattern = function () {}
module.exports = {
  direct (data, event, emitter, pattern, mapvalue) {
    // uses the map to find the subscriber(s)

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
    console.log('emit!!')
    // emit
    emitter.findEmit(data, event, this, mapvalue)
  },
  reference (data, event, emitter, pattern, mapvalue, map, context, contextmapvalue) {
    // needs some help to find the subscriber(s)

    // check if removed
    if (data === null) {

    }
    // emit
    emitter.findEmitRef(data, event, this, mapvalue, map, context, contextmapvalue)
  }
}

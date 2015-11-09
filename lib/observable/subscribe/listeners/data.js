'use strict'
var resolvePattern = function () {}
module.exports = {
  direct (data, event, emitter, pattern, mapvalue, map) {
    // uses the map to find the subscriber(s)

    // check if removed
    if (data === null) {
      console.error('ha!', mapvalue, map)
      let subscriber = emitter._parent.parent
      if (subscriber._input || map.parent){
        console.error('?/',subscriber)
        // resolvePattern(this, mapvalue)
        // check out best way to resubscribe
        pattern.val = true
        console.error('!')
        emitter.subField(data, event, subscriber, subscriber.pattern, 0, true, {})
      }
    }
    // emit
    emitter.findEmit(data, event, this, mapvalue, map)
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

'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    // do something with context resolvement
    // var resolver = {
    //   enpoint: this,
    //   map: mapvalue
    // }

    map[this.key] = mapvalue
    resolvePattern(this, mapvalue)
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), mapvalue, map)
  },
  reference (data, event, emitter, pattern, current, mapvalue, map) {
    map[this.key] = mapvalue
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), mapvalue, map)
  }
}

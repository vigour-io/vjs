'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    resolvePattern(this, mapvalue)
    map[this.key] = mapvalue
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
  }
}

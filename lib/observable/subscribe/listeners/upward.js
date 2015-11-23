'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
		event.fromParent = true
    resolvePattern(this, mapvalue)
    map[this.key] = JSON.parse(JSON.stringify(mapvalue))
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
  	event.fromParent = true
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
  }
}

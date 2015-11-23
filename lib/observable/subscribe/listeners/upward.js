'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
  	console.log('dir:upward', this.path)
		event.fromParent = true
    resolvePattern(this, mapvalue)
    console.log('JSON before',JSON.stringify(map,false,2))
    map[this.key] = JSON.parse(JSON.stringify(mapvalue))
    console.log('JSON',JSON.stringify(map,false,2))
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
  	console.log('ref:upward')
  	event.fromParent = true
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
  }
}

'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
  	console.log('dir:upward', this.path)
		event.fromParent = true
    resolvePattern(this, mapvalue)
    console.log('JSON map',JSON.stringify(map,false,2))
    console.log('JSON mapvalue',JSON.stringify(mapvalue,false,2))
    map = {}//JSON.parse(JSON.stringify(map))
    mapvalue = JSON.parse(JSON.stringify(mapvalue))
    map[this.key] = mapvalue
    console.log('JSON',JSON.stringify(map,false,2))
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
  	console.log('ref:upward')
  	event.fromParent = true
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
  }
}

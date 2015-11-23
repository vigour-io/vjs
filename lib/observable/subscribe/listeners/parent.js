'use strict'
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
		event.fromParent = true
    resolvePattern(this, mapvalue)
    map[this.key] = JSON.parse(JSON.stringify(mapvalue))
    emitter.subField({}, event, this.parent, pattern.sub_parent, current, map)
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
  	event.fromParent = true
    emitter.subFieldRef({}, event, this.parent, pattern.sub_parent, current, mapvalue, map, context)
  }
}

'use strict'
var resolvePattern = require('../resolve')
var clone = require('lodash/lang/cloneDeep')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    let map = {[this.key]: clone(mapvalue)}
    // event.fromParent = true
    resolvePattern(this, mapvalue, emitter.key)
    emitter.subField(true, event, this.parent, pattern.$parent, current, map)
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    // event.fromParent = true
    emitter.subFieldRef(true, event, this.parent, pattern.$parent, current, mapvalue, map, context)
  }
}

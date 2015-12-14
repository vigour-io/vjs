'use strict'
var resolvePattern = require('../resolve')
var clone = require('lodash/lang/cloneDeep')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    let map = {[this.key]: clone(mapvalue)}
    resolvePattern(this, mapvalue, emitter.key)
    emitter.subField(true, event, this.parent, pattern.$parent, current, map)
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    emitter.subFieldRef(true, event, this.parent, pattern.$parent, current, mapvalue, map, context)
  }
}

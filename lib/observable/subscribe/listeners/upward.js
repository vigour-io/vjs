'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')
var clone = require('lodash/lang/cloneDeep')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    let map = {[this.key]: clone(mapvalue)}
    event.fromParent = true
    pattern = resolvePattern(this, mapvalue, emitter.key)
    // if (!emitter.subObj(true, event, this, pattern, current, mapvalue, map)) {
      emitter.subUp(true, event, this.parent, pattern, incDepth(current), map, {})
    // }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    event.fromParent = true
    // if (!emitter.subObjRef(true, event, this, pattern, current, mapvalue, map, context)) {
      emitter.subUpRef(true, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
    // }
  }
}

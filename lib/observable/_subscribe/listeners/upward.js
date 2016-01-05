'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')
var clone = require('lodash/lang/cloneDeep')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    let map = {[this.key]: clone(mapvalue)}
    pattern = resolvePattern(this, mapvalue, emitter.key)
    emitter.subUp(true, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    emitter.subUpRef(true, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
  }
}

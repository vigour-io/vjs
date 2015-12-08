'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')
var clone = require('lodash/lang/cloneDeep')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue) {
    console.info('- - - fire upward:', this.path, JSON.stringify(mapvalue))
    let map = {[this.key]: clone(mapvalue)}
    event.fromParent = true
    pattern = resolvePattern(this, mapvalue, emitter.key)
    emitter.subUp(true, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    event.fromParent = true
    emitter.subUpRef(true, event, this.parent, pattern, incDepth(current), mapvalue, map, context)
  }
}

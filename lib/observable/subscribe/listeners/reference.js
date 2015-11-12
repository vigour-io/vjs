'use strict'
var reference = require('../../../util/get/reference')
var incLevel = require('../current/inc/level')
var getLevel = require('../current/get/level')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    var ref = reference(this)
    current = incLevel(current)
    resolvePattern(this, mapvalue)
    updatePattern(pattern, getLevel(current))
      // remove the listeners from the old reference
    if (ref) {
      if (emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, this)) {
        // this removes the parent listener if the subscription is fulfilled, not sure if this is right 
        this.off('parent', emitter.key)
      }
    }
  },
  reference(data, event, emitter, pattern, current, mapvalue, map, context) {
    var ref = reference(this)
    current = incLevel(current)

    resolvePattern(context, mapvalue)
    updatePattern(pattern, getLevel(current))
      // remove listeners from the previous reference
    if (ref) {
      if (emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, context)) {
        // this removes the parent listener if the subscription is fulfilled, not sure if this is right 
        this.off('parent', emitter.key)
      }
    }
  }
}

function updatePattern (pattern, level) {
  pattern.each((property) => {
    let value = property.val
    if (typeof value === 'number') {
      if (getLevel(value) >= level) {
        property.val = true
      }
    } else if (value !== true) {
      updatePattern(value, level)
    }
  })
}
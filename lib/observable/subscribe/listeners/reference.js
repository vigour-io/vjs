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
    // remove listeners from the previous reference
    // console.error('reference')
    if (ref) {
    // do something with context resolvement
    // var resolver = {
    //   enpoint: this,
    //   map: mapvalue
    // }
      console.error('reference', mapvalue, ref)
      emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, this)
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    var ref = reference(this)
    current = incLevel(current)
    updatePattern(pattern, getLevel(current))
    // remove listeners from the previous reference
    if (ref) {
      emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, context)
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

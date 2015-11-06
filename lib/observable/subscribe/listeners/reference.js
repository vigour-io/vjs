'use strict'
var reference = require('../../get/reference')
var incLevel = require('./current/inc/level')
var getLevel = require('./current/get/level')
var resolvePattern = require('./resolve')

exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    var ref = reference(this)
    current = incLevel(current)
    resolvePattern(this, mapvalue)
    updatePattern(pattern, getLevel(current))
    // remove listeners from the previous reference
    if (ref) {
    // do something with context resolvement
    // var resolver = {
    //   enpoint: this,
    //   map: mapvalue
    // }
      emitter.subObj({}, event, ref, pattern, current, mapvalue, map)
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map) {
    var ref = reference(this)
    current = incLevel(current)
    updatePattern(pattern, getLevel(current))
    // remove listeners from the previous reference
    if (ref) {
      emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map)
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

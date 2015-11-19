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
    let currentLevel = getLevel(current)
    removeListeners(emitter, currentLevel, this.uid)
    updatePattern(pattern, currentLevel)

    if (ref) {
      if (emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, this)) {
        // this removes the parent listener if the subscription is fulfilled, not sure if this is right
        this.off('parent', emitter.uid)
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    var ref = reference(this)
    current = incLevel(current)
    resolvePattern(this, mapvalue)

    let currentLevel = getLevel(current)
    removeListeners(emitter, currentLevel)
    updatePattern(pattern, currentLevel)

    if (ref) {
      if (emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, context)) {
        // this removes the parent listener if the subscription is fulfilled, not sure if this is right
        this.off('parent', emitter.uid)
      }
    }
  }
}

function updatePattern (pattern, level) {
  pattern.each(function (property) {
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

function removeListeners (emitter, currentLevel, uid) {
  var listeners = emitter.listensOnAttach
  if (listeners) {
    listeners.each(function (prop, key) {
      let attach = prop.attach
      attach.each(function (property, key) {
        var attached = property[2]
        if (getLevel(attached[2]) >= currentLevel && uid === attached[4].uid) {
          attach.removeProperty(property, key)
        }
      })
    })
  }
}

'use strict'
var reference = require('../../../util/get/reference')
var incLevel = require('../current/inc/level')
var getLevel = require('../current/get/level')

var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    var ref = reference(this)
    current = incLevel(current)
    resolvePattern(this, mapvalue, emitter.key)
    let currentLevel = getLevel(current)
    removeListeners(emitter, currentLevel, this.uid)
    updatePattern(pattern, currentLevel)

    if (ref) {
      if (emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, this)) {
        // this removes the parent listener if the subscription is fulfilled, not sure if this is right
        removeParentListeners(emitter)
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    var ref = reference(this)
    current = incLevel(current)
    resolvePattern(this, mapvalue, emitter.key)

    let currentLevel = getLevel(current)
    removeListeners(emitter, currentLevel)
    updatePattern(pattern, currentLevel)

    if (ref) {
      if (emitter.subObjRef({}, event, ref, pattern, current, mapvalue, map, context)) {
        // this removes the parent listener if the subscription is fulfilled, not sure if this is right
        removeParentListeners(emitter)
      }
    }
  }
}

function updatePattern (pattern, level) {
  for (var i in pattern) {
    if (i[0] !== '_' && i !== 'key') {
      let property = pattern[i]
      let value = property._input
      if (!value) {
        updatePattern(property, level)
      } else if (typeof value === 'number') {
        if (getLevel(value) >= level) {
          property.set(true)
        }
      }
    }
  }
}

function removeListeners (emitter, currentLevel, uid) {
  var listens = emitter.listensOnAttach
  for (var i in listens) {
    if (i[0] !== '_' && i !== 'key') {
      let attach = listens[i].attach
      for (let i in attach) {
        if (i[0] !== '_' && i !== 'key') {
          let property = attach[i]
          if (property) {
            let attached = property[2]
            if (getLevel(attached[2]) >= currentLevel && uid === attached[4].uid) {
              attach.removeProperty(property, i)
            }
          }
        }
      }
    }
  }
}

function removeParentListeners (emitter) {
  var listens = emitter.listensOnAttach
  for (var i in listens) {
    if (i[0] !== '_' && i !== 'key') {
      let property = listens[i]
      if (property.key === 'parentEmitter') {
        let attach = listens[i].attach
        for (let i in attach) {
          if (i[0] !== '_' && i !== 'key') {
            let property = attach[i]
            if (property) {
              let attached = property[1]
              if (attached === emitter) {
                attach.removeProperty(property, i)
              }
            }
          }
        }
      }
    }
  }
}

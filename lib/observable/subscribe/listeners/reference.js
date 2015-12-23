'use strict'
var reference = require('../../../util/get/reference')
var incLevel = require('../current/inc/level')
var getLevel = require('../current/get/level')

var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    var ref = reference(this)
    current = incLevel(current)
    var currentLevel = getLevel(current)
    pattern = resolvePattern(this, mapvalue, emitter.key)
    if (pattern) {
      if (data) {
        data.onSubRemove && data.onSubRemove(emitter, event)
        updatePattern(pattern, currentLevel)
        if (data._input !== null) {
          removeListeners(emitter, currentLevel)
        }
      }
      if (ref) {
        emitter.onSubHandler(event, pattern, ref, this)
        if (emitter.subObjRef(true, event, ref, pattern, current, mapvalue, map, this)) {
          // this removes the parent listener if the subscription is fulfilled, not sure if this is right
          // console.error('!')
          removeParentListeners(emitter)
        }
      }
    } else if (data && data.onSubRemove) {
      data.onSubRemove(emitter, event)
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    var ref = reference(this)
    current = incLevel(current)
    var currentLevel = getLevel(current)
    pattern = resolvePattern(this, mapvalue, emitter.key)
    if (pattern) {
      if (data) {
        data.onSubRemove && data.onSubRemove(emitter, event)
        updatePattern(pattern, currentLevel)
        if (data._input !== null) {
          removeListeners(emitter, currentLevel)
        }
      }
      if (ref) {
        emitter.onSubHandler(event, pattern, ref, this)
        if (emitter.subObjRef(true, event, ref, pattern, current, mapvalue, map, context)) {
          // this removes the parent listener if the subscription is fulfilled, not sure if this is right
          removeParentListeners(emitter)
        }
      }
    } else if (data && data.onSubRemove) {
      data.onSubRemove(emitter, event)
    }
  }
}

function updatePattern (pattern, level) {
  for (var i in pattern) {
    if (i[0] !== '_' && i !== 'key') {
      let field = pattern[i]
      let value = field._input
      if (!value) {
        updatePattern(field, level)
      } else if (typeof value === 'number' && getLevel(value) >= level) {
        field.set(true)
      }
    }
  }
}

function removeListeners (emitter, level) {
  var listens = emitter.listensOnAttach
  var id = emitter.uid
  for (var i in listens) {
    if (i[0] !== '_' && i !== 'key') {
      let attach = listens[i].attach
      for (let j in attach) {
        if (j[0] !== '_' && j !== 'key' && parseInt(j) === id) {
          let property = attach[j]
          if (property) {
            let attached = property[2]
            if (attached && getLevel(attached[2]) >= level) {
              attach.removeProperty(property, j)
            }
          }
        }
      }
    }
  }
}

function removeParentListeners (emitter) {
  var listens = emitter.listensOnAttach
  var id = emitter.id
  for (var i in listens) {
    if (i[0] !== '_' && i !== 'key') {
      let property = listens[i]
      if (property.key === 'parentEmitter') {
        let attach = listens[i].attach
        for (let i in attach) {
          if (i[0] !== '_' && i !== 'key' && parseInt(i) === id) {
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

'use strict'
var Base = require('../../../base')
var info = require('./info')

var onData = require('./on/data')

var isCloserOrSame = info.isCloserOrSame
var incrementDepth = info.incrementDepth
var incrementId = info.incrementId
var getLateral = info.getLateral
var getId = info.getId

var emit = require('./emit')

exports.subscribe = function (emitter, data, event, obj, pattern, key, info, mapvalue) {
  var value = pattern[key]
  var id

  info = incrementDepth(info)

  if (typeof value === 'object') {
    return emitter.subscribe(data, event, obj, value, info, mapvalue)
  }
  if (value === true) {
    info = incrementId(info)
    id = getId(info)
  } else if (isCloserOrSame(value, info)) {
    id = getId(value)
    removeChangeListener(emitter, id)
  }

  if (id) {

    let context = emitter._parent.parent

    pattern[key] = info
    obj.on('data', [onData, emitter, pattern, info, mapvalue, context], id)

    if (data) {
      if (!data.origin) {
        data.origin = obj
      }
      if (getLateral(info) > 0) {
        context.emit(emitter.key, data, event)
      } else {
        emit(data, event, obj, mapvalue, emitter.key, event && event.type === 'parent')
      }
    }

    removeReferenceListeners(emitter, info)
  }
  return value
}

exports.getReferenced = function (obj) {
  var referenced = obj._input
  return referenced && referenced instanceof Base && referenced
}

function removeChangeListener(emitter, id) {
  emitter.listensOnAttach.each(function (property) {
    if (property.key === 'data') {
      property.attach.each(function (prop, key) {
        if (key == id) {
          property.attach.removeProperty(prop, key)
        }
      })
    }
  })
}

function removeReferenceListeners(emitter, info) {
  var listeners = emitter.listensOnAttach
  if (listeners) {
    listeners.each(function (property) {
      if (property.key === 'reference') {
        var attach = property.attach
        attach.each(function (prop, key) {
          if (checkPatternIsFulfilled(prop[2][1]), info) {
            attach.removeProperty(prop, key)
          }
        })
      }
    })
  }
}

function checkPatternIsFulfilled(pattern, info) {
  for (var i in pattern) {
    let value = pattern[i]
    if (typeof value === 'object') {
      return checkPatternIsFulfilled(value)
    }
    if (value === true) {
      return
    }
    if (getId(value)) {
      return true
    }
  }
}

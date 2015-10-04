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
    pattern[key] = info
    obj.on('data', [onData, emitter, pattern, info, mapvalue], id)

    if (data) {
      if (getLateral(info) > 0) {
        emitter._parent._parent.emit(emitter.key, void 0, event)
      } else {
        emit(data, event, obj, mapvalue, emitter.key, event.type === 'parent')
      }
    }
  }
  return value
}

exports.getReferenced = function (obj) {
  var referenced = obj._input
  return referenced && referenced instanceof Base && referenced
}

function removeChangeListener (emitter, id) {
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

'use strict'
var Base = require('../../../base')
var info = require('./info')

var isCloserOrSame = info.isCloserOrSame
var incrementDepth = info.incrementDepth
var incrementId = info.incrementId
var getLateral = info.getLateral
var getId = info.getId

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
    obj.on('data', [onChange, emitter, pattern, info, mapvalue], id)

    if (data) {
      if (getLateral(info) > 0) {
        emitter._parent._parent.emit(emitter.key, void 0, event)
      } else {
        exports.emit(data, event, obj, mapvalue, emitter.key, event.type === 'addToParent')
      }
    }
  }
  return value
}

exports.emit = function (data, event, property, mapvalue, key, noinstances) {
  var next = property
  var value
  for (var i in mapvalue) {
    value = mapvalue[i]
    if (value) {
      next = property[i]
      if (next) {
        if (value === true) {
          next.emit(key, void 0, event)
          mapvalue[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            next.emit(key, void 0, event)
          }
        } else {
          // dit moet wrong zijn
          exports.emit(data, event, next, value, key, noinstances)
        }
      } else {
        mapvalue[i] = null
      }
    }
  }
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

function onChange (data, event, emitter, pattern, info, mapvalue) {
  if (data === null) {
    var subsOrigin = emitter._parent._parent
    if (subsOrigin._input || mapvalue['parent']) {
      pattern[this.key] = true
      emitter.subscribe(data, event, subsOrigin, emitter._pattern)
    }
  }

  if (getLateral(info) > 0) {
    emitter._parent._parent.emit(emitter.key, event)
  } else {
    exports.emit(data, event, this, mapvalue, emitter.key)
  }
}

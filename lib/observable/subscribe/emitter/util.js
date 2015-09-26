'use strict'
var Base = require('../../../base')
var info = require('./info')

var isCloserOrSame = info.isCloserOrSame
var incrementDepth = info.incrementDepth
var incrementId = info.incrementId
var getLateral = info.getLateral
var getId = info.getId

exports.subscribe = function (emitter, event, meta, obj, pattern, key, info, mapvalue) {
  var value = pattern[key]
  var id

  info = incrementDepth(info)

  if (typeof value === 'object') {
    return emitter.subscribe(event, meta, obj, value, info, mapvalue)
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
    obj.on('change', [onChange, emitter, pattern, info, mapvalue], id)

    if (meta) {
      if (getLateral(info) > 0) {
        emitter._parent._parent.emit(emitter.key, event)
      } else {
        exports.emit(event, meta, obj, mapvalue, emitter.key, event.type === 'addToParent')
      }
    }
  }
  return value
}

exports.emit = function (event, meta, property, mapvalue, key, noinstances) {
  var next = property
  var value
  for (var i in mapvalue) {
    value = mapvalue[i]
    if (value) {
      next = property[i]
      if (next) {
        if (value === true) {
          next.emit(key, event)
          mapvalue[i] = 1
        } else if (value === 1) {
          if (!noinstances) {
            next.emit(key, event)
          }
        } else {
          exports.emit(event, meta, next, value, key, noinstances)
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
    if (property.key === 'change') {
      property.attach.each(function (prop, key) {
        if (key == id) {
          property.attach.removeProperty(prop, key)
        }
      })
    }
  })
}

function onChange (event, meta, emitter, pattern, info, mapvalue) {
  if (meta) {
    var subsOrigin = emitter._parent._parent
    if (subsOrigin._input || mapvalue['parent']) {
      pattern[this.key] = true
      emitter.subscribe(event, meta, subsOrigin, emitter._pattern)
    }
  }

  if (getLateral(info) > 0) {
    emitter._parent._parent.emit(emitter.key, event)
  } else {
    exports.emit(event, meta, this, mapvalue, emitter.key)
  }
}

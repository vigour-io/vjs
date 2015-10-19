'use strict'
var Base = require('../../../base')
var info = require('./info')

var onData = require('./on/data')

var isCloserOrSame = info.isCloserOrSame
// var incrementDepth = info.incrementDepth
var setId = info.setId
var getLateral = info.getLateral
var getId = info.getId

var emit = require('./emit')

exports.subscribe = function (emitter, data, event, obj, pattern, key, info, mapvalue) {
  var value = pattern[key]
  var id

  // info = incrementDepth(info)

  if (typeof value === 'object') {
    return emitter.subscribe(data, event, obj, value, info, mapvalue)
  }

  if (value === true) {
    info = setId(info, emitter.generateId())
    id = getId(info)
    // TODO perhaps it should only fire when closer!
  } else if (isCloserOrSame(value, info)) {
    id = getId(value)
    info = setId(info, id)
    removeChangeListener(emitter, id)
  }

  if (id) {
    let context = emitter._parent.parent

    if(pattern[key] === info){
      console.warn('hmm already have this, wrong')
    }

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

    removeReferenceListeners(emitter)
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

function removeReferenceListeners(emitter) {
  var listeners = emitter.listensOnAttach
  if (listeners) {
    listeners.each(function (property) {
      if (property.key === 'reference') {
        let attach = property.attach
        attach.each(function (prop, key) {
          if (!keepRefListener(prop[2][1], prop[3])) {
            attach.removeProperty(prop, key)
          }
        })
      }
    })
  }
}

function keepRefListener(pattern, info) {
  for (var i in pattern) {
    let value = pattern[i]
    if (typeof value === 'object') {
      return keepRefListener(value, info)
    }
    if (value === true) {
      return true
    }
    if(isCloserOrSame(value, info)){
      return true
    }
  }
}

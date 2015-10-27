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
  if(key === 'parent'){
    key = 'sub_parent'
  }

  var value = pattern[key].val
  var id

  if (typeof value === 'object') {
    return emitter.subscribe(data, event, obj, value, info, mapvalue)
  }

  console.log('---->',emitter.listensOnAttach)

  if (value === true) {
    info = setId(info, emitter.generateId())
    id = getId(info)
  } else if (isCloserOrSame(value, info)) {
    id = getId(value)
    info = setId(info, id)
    removeChangeListener(emitter, id)
  }

  if (id) {
    if (value === info) {
      console.warn('hmm already have this, wrong')
    }

    let context = emitter._parent.parent
    
    if (data) {
      data.origin = obj
      if (getLateral(info) > 0) {
        if (data.context) {
          context = emit(data, event, data.context, data.map, emitter.key, event && event.type === 'parent')
        } else {
          emitter.emit(data, event, context)
        }
      } else {

        console.log(JSON.stringify(mapvalue,false,2), event.type)

        emit(data, event, obj, mapvalue, emitter.key, event && event.type === 'parent')
      }
    }

    pattern[key].val = info
      //check if not added double!
    obj.on('data', [onData, emitter, pattern, info, mapvalue, context], id)
    removeReferenceListeners(emitter, pattern)
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
  return pattern.each((property, key) => {
    let value = property.val
    if (typeof value === 'object') {
      return keepRefListener(value, info)
    }
    if (value === true) {
      return true
    }
    if (isCloserOrSame(value, info)) {
      return true
    }
  })
}

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

  console.log('info?',info)

  info = incrementDepth(info)

  console.log('new info?',info)
  console.log('lateral?',getLateral(info))



  console.log('value',value)

  if (typeof value === 'object') {
    return emitter.subscribe(data, event, obj, value, info, mapvalue)
  }
  console.log('   ??   ', value === true || isCloserOrSame(value, info))
  if (value === true) {
    info = incrementId(info)
    id = getId(info)
  } else if (isCloserOrSame(value, info)) {
    id = getId(value)
    removeChangeListener(emitter, id)
  }

  console.log(id, window.getId(info))

  if (id) {
    console.log(obj._context)
    console.log('reference?', data && data.reference)

    let context = emitter._parent.parent


    console.log('set pattern val',info)

    pattern[key] = info
    obj.on('data', [onData, emitter, pattern, info, mapvalue, context], id)

    if (data) {
      if (!data.origin) {
        data.origin = obj
      }
      if (getLateral(info) > 0) {
        console.log('getLateral')
        // console.log(emitter._parent._context, emitter._parent.parent.parent.parent)
        // console.log(' ref emit from event', emitter._parent.parent.key, emitter._parent.parent)


        context.emit(emitter.key, data, event)
      } else {
        console.log(' regular emit from event')
        emit(data, event, obj, mapvalue, emitter.key, event && event.type === 'parent')
      }
    }
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

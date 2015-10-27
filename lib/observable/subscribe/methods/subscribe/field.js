'use strict'
// var onData = require('../../on/data')
var info = require('../../info')
  // var emit = require('./emit')

var isCloserOrSame = info.isCloserOrSame
var getLateral = info.getLateral
var setId = info.setId
var getId = info.getId

module.exports = function subscribeField(data, event, obj, pattern, key, info, mapValue) {
  if (key === 'parent') {
    key = 'sub_parent'
  }

  console.info('subscribeField:', key, pattern)

  var patternValue = pattern[key].val
  var id

  if (typeof patternValue === 'object') {
    return this.subscribeObject(data, event, obj, patternValue, info, mapValue)
  }

  if (patternValue === true) {
    id = this.generateId()
    info = setId(info, id)
  } else if (isCloserOrSame(patternValue, info)) {
    id = getId(patternValue)
    info = setId(info, id)
    removeChangeListener(emitter, id)
  }

  if (id) {
    if (patternValue === info) {
      console.warn('hmm already have this, wrong')
    }

    let onData = getLateral(info) ? onDataReference : onDataDirect
    let subscriber = this._parent.parent
    this.addSubListener(obj, 'data', [onData, this, pattern, mapValue, subscriber], id)

    if (data) {
      onData.call(obj, data, event, this, pattern, mapValue, subscriber)
    }

    // let context = emitter._parent.parent

    // if (data) {
    //   data.origin = obj
    //   if (getLateral(info) > 0) {
    //     if (data.context) {
    //       context = emit(data, event, data.context, data.map, emitter.key, event && event.type === 'parent')
    //     } else {
    //       emitter.emit(data, event, context)
    //     }
    //   } else {
    //     emit(data, event, obj, mapValue, emitter.key, event && event.type === 'parent')
    //   }
    // }

    // pattern[key].val = info
    //   //check if not added double!
    // obj.on('data', [onData, emitter, pattern, info, mapValue, context], id)
    // removeReferenceListeners(emitter, pattern)
  }
  return patternValue
}

function onDataReference (data, event, emitter, pattern, mapValue, subscriber) {
  console.info('onDataReference:')
  emitter.emit(getData(this, data), event, subscriber)
}

function onDataDirect (data, event, emitter, pattern, mapValue, subscriber) {
  if (data === null) {
    if (subscriber._input || mapValue.parent) {
      console.info('onRemove:', this.key, pattern)
        // TODO clean this one! Now we are redoing entire subscription
      pattern[this.key].val = true
      emitter.subscribeObject(data, event, subscriber, pattern)
    }
  }
  emit(getData(this, data), event, this, mapValue, emitter.key)
}

function getData (origin, data) {
  if (data && typeof data === 'object') {
    if (!data.origin) {
      data.origin = origin
    }
  } else {
    data = {
      origin: origin,
      previous: data
    }
  }
  return data
}

function emit(data, event, property, mapValue, key, noinstances) {
  if (mapValue === true) {
    property.emit(key, data, event)
    return property
  }
  for (var i in mapValue) {
    let value = mapValue[i]
    if (value) {
      let next = property[i]
      if (next) {
        return emit(data, event, next, value, key, noinstances)
      } else {
        mapValue[i] = null
      }
    }
  }
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

// function removeReferenceListeners (emitter) {
//   var listeners = emitter.listensOnAttach
//   if (listeners) {
//     listeners.each(function (property) {
//       if (property.key === 'reference') {
//         let attach = property.attach
//         attach.each(function (prop, key) {
//           if (!keepRefListener(prop[2][1], prop[3])) {
//             attach.removeProperty(prop, key)
//           }
//         })
//       }
//     })
//   }
// }

// function keepRefListener (pattern, info) {
//   return pattern.each((property, key) => {
//     let patternValue = property.val
//     if (typeof patternValue === 'object') {
//       return keepRefListener(patternValue, info)
//     }
//     if (patternValue === true) {
//       return true
//     }
//     if (isCloserOrSame(patternValue, info)) {
//       return true
//     }
//   })
// }

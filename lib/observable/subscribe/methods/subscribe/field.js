'use strict'
var onData = require('../on/data')
var info = require('../info')
var emit = require('./emit')

var isCloserOrSame = info.isCloserOrSame
var getLateral = info.getLateral
var setId = info.setId
var getId = info.getId

module.exports = function (emitter, data, event, obj, pattern, key, info, mapValue) {
  if (key === 'parent') {
    key = 'sub_parent'
  }

  var patternValue = pattern[key].val
  var id

  if (typeof patternValue === 'object') {
    return emitter.subscribeObject(data, event, obj, patternValue, info, mapValue)
  }

  if (patternValue === true) {
    id = emitter.generateId()
    info = setId(info, id)
    // id = getId(info)
  } else if (isCloserOrSame(patternValue, info)) {
    id = getId(patternValue)
    info = setId(info, id)
    // removeChangeListener(emitter, id)
  }

  if (id) {
    if (patternValue === info) {
      console.warn('hmm already have this, wrong')
    }

    console.info('should fire and/or listen')

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

// function removeChangeListener (emitter, id) {
//   emitter.listensOnAttach.each(function (property) {
//     if (property.key === 'data') {
//       property.attach.each(function (prop, key) {
//         if (key == id) {
//           property.attach.removeProperty(prop, key)
//         }
//       })
//     }
//   })
// }

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

'use strict'
var isEmpty = require('../../util/is/empty')
module.exports = function triggerInternal (binds, event) {
  if (binds) {
    // delete binds.val // make this better
    for (let uid in binds) {
      if (uid !== 'val') {
        let bind = binds[uid]
        let data
        // store context for a bind only needs one (think about multiple later)

        // make seperate functions if you dont want this -- more performance (no checks)
        if (this.emitInstances) {
          emitInstances(bind, this, event, data)
        }

        // stil missing
        // emitting on specific contexts (only do contexts -- easy check for ._context)
        // may fire stuff double??? (perhaps not)
        //
        // data !!!! very importante
        //
        // make more sharing between emitters for the datax
        // properties can simply be send by sending the set obj part that a data listener got saves extra array and keys

        // if (!bind._context) {
        this.execInternal(bind, event, data)
        // }
        let parent = bind.parent
        if (parent) {
          emitContext(parent, bind, event, data, this)
        }
      }
    }
  }
}

function emitContext (parent, bind, event, data, emitter) {
  // if bind._context use context!
  // share this over binds etc
  let contextInstances
  let parentInstances
  let path = []
  let instance
  // store this way more efficient (can be cached easyly!)
  while (parent) {
    parentInstances = parent.getInstances()
    if (parentInstances) {
      contextInstances = parentInstances
      break
    }
    path.push(parent.key)
    parent = parent._parent
  }
  if (contextInstances) {
    for (let i = 0, length = contextInstances.length; i < length; i++) {
      instance = contextInstances[i]
      // instance.clearContext()
      for (let j = path.length - 1; j >= 0 && instance; j--) {
        instance = instance[path[j]]
      }
      if (instance && instance[bind.key] === bind) {
        // ok so no data yet , no exclusion but system
        emitter.execInternal(bind, event, data)
      }
    }
  }
  // ----need to figure this one out------
  // bind.clearContextUp()
}

function emitInstances (bind, emitter, event, data) {
  let instances = bind.getInstances()
  // context will become more elloborate
  if (instances) { // && !bind._context
    let instance
    let length = instances.length
    for (let i = 0; i < length; i++) {
      instance = instances[i]
      if (instance.__on && instance.__on[emitter.key] !== emitter) {
        emitter = instance.__on[emitter.key]
        emitter.execInternal(instance, event, data)
        emitInstances(instance, instance.__on[emitter.key], event, data)
        emitContext(instance.parent, instance, event, data, emitter)
      } else {
        emitInstances(instance, emitter, event, data)
        emitter.execInternal(instance, event, data)
        emitContext(instance.parent, instance, event, data)
      }
      // also go for instances of instances
      // if (!isOverwritten(this, instance, data, key)) {
      // instance.emit(key, data, event)
      // }
    }
  }
}

//
// while (parent) {
//   parentInstances = parent.getInstances()
//   if (parentInstances) {
//     contextInstances = parentInstances
//     break
//   }
//   path.push(parent.key)
//   parent = parent._parent
// }
//
// if (contextInstances) {
//   for (let i = 0, length = contextInstances.length; i < length; i++) {
//     instance = contextInstances[i]
//     instance.clearContext()
//
//     for (let j = path.length - 1; j >= 0 && instance; j--) {
//       property = path[j]
//       instance = instance[property]
//     }

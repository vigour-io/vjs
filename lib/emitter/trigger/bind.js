'use strict'

module.exports = function (emitter, bind, event, data) {
  let parent = bind._parent
  let context = bind._context
  if (parent) {
    emitContext(parent, bind, event, data, emitter, context)
  }
  if (!context) {
    bind.clearContextUp()
    if (emitter.emitInstances) {
      emitInstances(bind, emitter, event, data)
    }
    emitter.execInternal(bind, event, data)
    // restore context obviously nessecary here
  }
}

function emitContext (parent, bind, event, data, emitter, context) {
  let contextInstances
  let parentInstances
  let path = [] // dont make a path its ballzstore it and chnage when it changes must be lighter
  let instance
  // make with context a seperate funciton and make it super efficient
  while (parent) {
    parentInstances = parent.getInstances() // how to do this smartly?
    // this is pretty sweet but we need something for when context
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
      // multi context -- simple store context on the store
      // cant we do this more efficiently? e.g. just
      if (!context || instance === context) {
        for (let j = path.length - 1; j >= 0 && instance; j--) {
          instance = instance[path[j]]
        }
        if (instance && instance[bind.key] === bind) {
          // ok so no data yet , no exclusion but system use data stuff for this isOverwritten
          emitter.execInternal(bind, event, data)
        }
        // context (multi context) can be geatly optmized
        if (context) {
          break
        }
      }
    }
  }
}

function emitInstances (bind, emitter, event, data, context) {
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

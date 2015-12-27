'use strict'

module.exports = function (emitter, bind, event, data) {
  console.log('lezzz emit it!', emitter.path)
  let parent = bind.parent
  if (parent) {
    emitContext(parent, bind, event, data, emitter)
  }
  bind.clearContextUp()
  if (emitter.emitInstances) {
    emitInstances(bind, emitter, event, data)
  }
  emitter.execInternal(bind, event, data)
}

function emitContext (parent, bind, event, data, emitter) {
  let contextInstances
  let parentInstances
  let path = []
  let instance
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
        // ok so no data yet , no exclusion but system use data stuff for this isOverwritten
        emitter.execInternal(bind, event, data)
      }
    }
  }
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

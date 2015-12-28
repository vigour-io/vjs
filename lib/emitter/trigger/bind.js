'use strict'
require('colors-browserify')
console.line = false
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

function emitContext (parent, bind, event, data, emitter, context, spath) {
  let parentInstances
  let instance
  let path
  while (parent && !parent._context) {
    parentInstances = parent.getInstances()
    if (parentInstances) {
      for (let i = 0, length = parentInstances.length; i < length; i++) {
        instance = parentInstances[i]
        if (!context || instance === context) {
          if (path) {
            // store this path super much nicer
            for (let j = path.length - 1; j >= 0 && instance; j--) {
              instance = instance[path[j]]
            }
          }
          if (instance && instance[bind.key] === bind) {
            emitter.execInternal(bind, event, data)
          }
          emitContext(instance, bind, event, data, emitter, false, path) // not a lot of sanitazion going on like this..
          if (context) {
            return
          }
        }
      }
      return
    }
    if (!path) {
      // THIS IS WAY TOO MUCH CREATION THATS GOING HERE
      path = spath ? spath.concat([]) : []
    }
    path.push(parent.key) // reuse!!! godamn must be easy
    parent = parent._parent
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

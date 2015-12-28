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

/*
**** WARNING ****
* cannot use double inheritance paths
* var Thing = new Elem({ text: })
* var Page = new Elem({ gurk: { thing: new Thing }})
* when you start making instances of page.gurk -- gurk will be used as top level -- if this become a problem we have to think of something
* can be much unified with element and subs i supose -- its just storing common ancestor paths exactly what we want for subs
* how to do how to do
* prob just storing them
* has to be greedy and smarter in doing things
*
* **** WARNING 2 ****
* for condition when using defered events context will be pretty much lost (dont want to store on defaut event)
* the condition event will handle this itself
*
* **** WARNING 3 ****
* context does not get restored -- dont want to store context chains
*/

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
            for (let j = path.length - 1; j >= 0 && instance; j--) {
              instance = instance[path[j]]
            }
          }
          if (spath) {
            for (let j = spath.length - 1; j >= 0 && instance; j--) {
              instance = instance[spath[j]]
            }
          }
          if (instance && instance[bind.key] === bind) {
            emitter.execInternal(bind, event, data)
          }
          emitContext(instance, bind, event, data, emitter, false, path)
          // false may be heavy
          if (context) {
            return
          }
        }
      }
      // if we want absolute correct we need to conitnue here (multiple parent -- to stupid)
      return
    }
    if (!path) {
      // **** THIS IS WAY TOO MUCH CREATION THATS GOING HERE STORE THIS PATH ****
      path = []
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

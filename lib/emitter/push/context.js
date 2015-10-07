'use strict'

module.exports = function bindContextInternal (emitter, bind, event) {
  var stamp = event.stamp
  var binds = emitter.contextBinds
  var context = bind._context
  var stampBinds = binds && binds[stamp]

  //OPTIMIZE OPTIMIZE OPTIMIZE

  // if (!stampBinds || !isIncluded(stampBinds, context)) {
    if (!emitter.hasOwnProperty('contextBinds')) {
      emitter.contextBinds = binds = {}
    }
    if (!binds[stamp]) {
      binds[stamp] = stampBinds = []
    }
    stampBinds.push(bind.storeContextChain())
    return true
  // }
}

function contextUpCompare (context, contextStore) {
  var contextUp = context
  var i = 0
  var same = 0
  while (contextUp) {
    if (contextStore[i]) {
      if (contextStore[i].context === contextUp) {
        same++
      }
    }
    i++
    contextUp = contextUp._context
  }
  return (contextStore.length === i && same === i)
}

function isIncluded (binds, context) {
  // how to do this fast???
  // chains can change
  if (!binds) {
    return
  }
  for (var i in binds) {
    if (contextUpCompare(context, binds[i])) {
      return true
    }
  }
}

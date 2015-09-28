'use strict'

module.exports = function bindContextInternal (emitter, bind, event) {
  var stamp = event.stamp
  var binds = emitter.contextBinds
  var context = bind._context
  var stampBinds = binds && binds[stamp]

  if (!stampBinds || !isIncluded(stampBinds, context)) {
    if (!emitter.hasOwnProperty('contextBinds')) {
      emitter.contextBinds = binds = {}
    }
    if (!binds[stamp]) {
      binds[stamp] = stampBinds = []
    }
    stampBinds.push(bind.storeContextChain())
    return true
  }
}

// make this into a utility
function isAncestor (ancestor, child) {
  var parent = child
  while (parent) {
    parent = parent._parent
    if (parent && parent._Constructor &&
      (ancestor === parent ||
      (ancestor instanceof parent._Constructor))
    ) {
      return true
    }
  }
}

function contextUpCompare (context, contextStore) {
  var contextUp = context
  var i = 0
  var same = 0
  var ignoreLength
  while (contextUp) {
    if (contextStore[i]) {
      if (contextStore[i].context === contextUp) {
        same++
      } else if (isAncestor(contextUp, contextStore[i].context)) {
        same++
        ignoreLength = true
      }
    }
    i++
    contextUp = contextUp._context
  }
  return ((ignoreLength || contextStore.length === i) && same === i)
}

function isIncluded (binds, context) {
  if (!binds) {
    return
  }
  for (var i in binds) {
    if (contextUpCompare(context, binds[i])) {
      return true
    }
  }
}

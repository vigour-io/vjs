'use strict'

module.exports = function bindContextInternal (emitter, bind, event) {
  var stamp = event.stamp
  var binds = emitter.contextBinds
  var stampBinds = binds && binds[stamp]
  var chain = bind.storeContextChain()
  var key = createKey(chain)
  if (!stampBinds || !stampBinds[key]) {
    if (!emitter.hasOwnProperty('contextBinds')) {
      emitter.contextBinds = binds = {}
    }
    if (!binds[stamp]) {
      binds[stamp] = stampBinds = {
        first: chain
      }
    }
    stampBinds[key] = chain
    return true
  }
}

function createKey (chain) {
  var str = ''
  // store in bits later for optmizations -- check if hashing is faster
  for (var i = 0, length = chain.length; i < length; i++) {
    str += chain[i].context.uid + '.'
    // can also do maps?
  }
  return str
}

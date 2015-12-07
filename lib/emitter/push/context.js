'use strict'

module.exports = function bindContextInternal (emitter, bind, event) {
  var stamp = event.stamp
  var binds = emitter.contextBinds
  var stampBinds = binds && binds[stamp]
  var chain = bind.storeContextChain()
  // kan de data nog verschillen? niet echt...
  // maybe make a map
  // {
  //   [uid]: {
  //     context: []
  //   }
  // }
  var key = createKey(chain)

  console.log('CONTEXT', bind.uid, key) // would this be enough?

  if (!stampBinds || !stampBinds[key]) {
    if (!emitter.hasOwnProperty('contextBinds')) {
      emitter.contextBinds = binds = {}
    }
    if (!binds[stamp]) {
      binds[stamp] = stampBinds = {
        first: chain // this is to restore
      }
    }
    stampBinds[key] = chain
    return true
  }
}

function createKey (chain) {
  var str = ''
  // store in bits later for optmizations -- check if hashing is faster
  var length = chain.length
  if (length === 1) {
    return chain[0].context.uid
  }
  str = chain[0].context.uid
  for (let i = 1, length = chain.length; i < length; i++) {
    str += '.' + chain[i].context.uid
    // what about doing it by storing only uid?
    // can also do maps?
  }
  return str
}

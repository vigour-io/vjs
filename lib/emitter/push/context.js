'use strict'

module.exports = function bindContextInternal (emitter, bind, event, data) {
  var chain = bind.storeContextChain()
  if (!emitter.getContextBind(event, bind, chain)) {
    let bound = emitter.setContextBind(event, bind, data, chain)
    if (!bound.context) {
      bound.context = chain
    }
    return true
  }
}

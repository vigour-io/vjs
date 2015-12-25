'use strict'

exports.inject = require('./bind')

exports.define = {
  push (bind, event, data) {
    // make a cnt -- use that to determine if this is nessecary
    if (this.fire) { // make better
      if (bind._context) {
        // this chain is pure horror unify with instances
        let chain = bind.storeContextChain()
        if (!this.getContextBind(event, bind, chain)) {
          let bound = this.setContextBind(event, bind, data, chain)
          if (!bound.context) {
            bound.context = chain
          }
          return bound
        }
      } else if (!this.getBound(event, bind, 'val')) {
        return this.setBind(event, bind, data)
      }
    }
  }
}

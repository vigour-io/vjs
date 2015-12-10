'use strict'

exports.inject = require('./bind')

exports.define = {
  push: function (bind, event, data) {
    if (!bind) {
      console.log(event)
      if (event) {
        console.log('ok?', event.stamp)
        if (!this.getBind(event, this, 'val')) {
          return this.setBind(event, this, data)
        }
      }
      // non observable case
      // meer equal
      // return bindInstances(this, this, event, data)
    } else if (bind._context) {
      let chain = bind.storeContextChain()
      if (!this.getContextBind(event, bind, chain)) {
        let bound = this.setContextBind(event, bind, data, chain)
        if (!bound.context) {
          bound.context = chain
        }
        return bound
      }
    } else if (!this.getBind(event, bind, 'val')) {
      return this.setBind(event, bind, data)
    }
  }
}

'use strict'

exports.define = {
  emitContext (emitter, data, event) {
    if (emitter.emitContexts) {
      // maybe add .executeContexts
      // this has to become way way faster
      var parent = this.parent
      if (parent) {
        var contextInstances, stored, instance, property, path, parentInstances
        path = [this.key]
        if (!this.hasOwnProperty('_storedChain')) {
          stored = this.storeContextChain()
          this._storedChain = true
        }

        console.warn('context time----')
        while (parent) {
          parentInstances = parent.getInstances()
          console.log(' ---> xxxinstance!', parent._path, !!parent._parent)
          // no instances (its in context ofc)
          // does not fire for instances
          if (parentInstances) {
            console.log('gotz them', parent._path)
            //if context add the context emits!

            contextInstances = parentInstances
            break
          }
          console.log(' ---> push! instance!', parent.key, parent._path)

          // make second path nessecary for usevals

          path.push(parent.key)
          // difference between the 2
          parent = parent._parent
        }

        if (contextInstances) {
          for (let i = 0, length = contextInstances.length; i < length; i++) {
            instance = contextInstances[i]
            instance.clearContext()

            for (let j = path.length - 1; j >= 0 && instance; j--) {
              property = path[j]
              instance = instance[property]
            }
            console.log('instance!', property, path, instance && instance.path)

            if (
              instance &&
              instance === this &&
              (instance._on && instance._on[emitter.key] === emitter) &&
              emitter.push(instance, event)
            ) {
              // this guy emits it again -- should not rly be nessecary
              console.log('context emit!', instance.path)
              // here comes the weird part
              // only instance thats found is the context one
              instance.emitContext(emitter, data, event)
            }
          }
        }

        if (stored) {
          this.setContextChain(stored)
          delete this._storedChain
        }
      }
    }
  }
}

'use strict'
exports.define = {
  emitContext (emitter, data, event) {
    if (emitter.emitContexts) {
      var parent = this.parent
      if (parent) {
        var contextInstances, stored, instance, property, path, parentInstances
        path = [this.key]
        if (!this.hasOwnProperty('_storedChain')) {
          stored = this.storeContextChain()
          this._storedChain = true
        }

        while (parent) {
          parentInstances = parent.getInstances()
          if (parentInstances) {
            contextInstances = parentInstances
            break
          }
          path.push(parent.key)
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

            if (
              instance &&
              instance === this &&
              (instance._on && instance._on[emitter.key] === emitter) &&
              emitter.push(instance, event)
            ) {
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

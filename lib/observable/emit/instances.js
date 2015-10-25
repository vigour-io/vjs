'use strict'

exports.define = {
  emitInstances: function (emitter, data, event) {
    // pass along meta
    if (emitter.emitInstances) {
      let instances = this.getInstances()
      let instance
      if (instances && !this._context) {
        for (let i = 0, length = instances.length; i < length; i++) {
          instance = instances[i]
          instance.emit(emitter.key, data, event)
        }
      }
    }
  }
}

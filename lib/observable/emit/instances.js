'use strict'

exports.define = {
  emitInstances: function (emitter, data, event) {
    // pass along meta
    if (emitter.emitInstances) {
      var instances = this.getInstances()
      var instance
      if (instances && !this._context) {
        for (var i = 0, length = instances.length; i < length; i++) {
          instance = instances[i]
          instance.emit(emitter.key, data, event)
        }
      }
    }
  }
}

'use strict'

exports.define = {
  emitInstances: function (emitter, event, args) {
    if (emitter.executeInstances) {
      var instances = this.instances
      var instance
      if (instances && !this._context) {
        for (var i = 0, length = instances.length; i < length; i++) {
          instance = instances[i]
          instance.emit.apply(instance, args)
        }
      }
    }
  }
}

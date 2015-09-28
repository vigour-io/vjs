'use strict'

exports.define = {
  emitInstances: function (emitter, event) {
    if (emitter.emitInstances) {
      var instances = this.getInstances()
      var instance
      if (instances && !this._context) {
        console.log('not context?', this._path, emitter.key)
        for (var i = 0, length = instances.length; i < length; i++) {
          instance = instances[i]
          instance.emit(emitter.key, event)
        }
      }
    }
  }
}

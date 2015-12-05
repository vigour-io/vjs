'use strict'
var isOverwritten = require('./overwrite')

exports.define = {
  emitInstances (emitter, data, event, key) {
    // !emitter is obviously super slow!
    // some emitter dont work here i geuss...
    if (!emitter || emitter.emitInstances) {
      let instances = this.getInstances()
      if (instances && !this._context) {
        let instance
        let length = instances.length
        for (let i = 0; i < length; i++) {
          instance = instances[i]
          if (!isOverwritten(this, instance, data, key)) {
            instance.emit(key, data, event)
          }
        }
      }
    }
  }
}
// different for data!

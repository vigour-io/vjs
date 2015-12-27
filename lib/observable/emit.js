'use strict'
var Event = require('../event')
exports.inject = require('./instances')

exports.define = {
  emit (key, data, event, ignore) {
    if (event === false) {
      return
    }
    let trigger
    if (event === void 0) {
      if (ignore) {
        return
      }
      event = new Event(this, key)
      trigger = true
    }
    if (!ignore) {
      let on = this._on
      if (on) {
        let override = on._properties._overrides[key]
        if (override) {
          key = override
        }
        let emitter = on[key]
        if (emitter) {
          emitter.emitInternal(data, event, this)
        }
      }
    }
    if (trigger) {
      event.trigger()
    }
  }
}

/*

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
*/

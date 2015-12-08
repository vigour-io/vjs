'use strict'

var Emitter = require('../../emitter')
var _emit = Emitter.prototype.emit

exports.inject = [
  require('../instances'),
  require('./instances'),
  require('./context')
]
exports.define = {
  getTriggerEvent (key) {
    var isProperty = this.getProperty('on', key, 'base')
    return (!isProperty || isProperty.triggerEvent)
  },
  emit (key, data, event, ignore) {
    // maybe do this with a extend or use or something
    return _emit.call(this, data, event, this, key, ignore)
  },
  emitInternal (data, event, bind, key, trigger, ignore) {
    var on = this._on
    if (on) {
      let override = on.getProperty(key, 'override')
      if (override) {
        key = override
      }
      let emitter = on[key]
      if (!ignore) {
        if (emitter) {
          if (!(emitter instanceof Emitter)) {
            throw new Error('observable.emit - can only emit on emitters key: "' + key + '"')
          }
          let context = this._context
          this.emitInstances(emitter, data, event, key)
          this.emitContext(emitter, data, event)
          emitter.emit(data, event, this)
          if (!context) {
            this.clearContext()
          }
        } else {
          // this is a bit dirty and heavy!
          this.emitInstances(void 0, data, event, key)
        }
      }
    }
    return trigger
  }
}

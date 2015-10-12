'use strict'
var Emitter = require('../../emitter')
var _emit = Emitter.prototype.emit

exports.inject = [
  require('../instances'),
  require('./instances'),
  require('./context')
]

exports.define = {
  getTriggerEvent: function (key) {
    var isProperty = this.getProperty('on', key, 'base')
    return (!isProperty || isProperty.triggerEvent)
  },
  emit: function (key, data, event, ignore) {
    // maybe do this with a extend or use or something
    return _emit.call(this, data, event, this, key, ignore)
  },
  emitInternal: function (data, event, bind, key, trigger, ignore) {
    var on = this._on
    var emitter
    var override
    if (on) {
      override = on.getProperty(key, 'override')
      if (override) {
        key = override
      }
      emitter = on[key]
      if (emitter && !ignore) {
        if (!(emitter instanceof Emitter)) {
          throw new Error('observable.emit - can only emit on emitters key: "' + key + '"')
        }
        var context = this._context
        this.emitInstances(emitter, data, event)
        this.emitContext(emitter, data, event)
        emitter.emit(data, event, this)
        if (!context) {
          this.clearContext()
        }
      }
    }
    return trigger
  }
}

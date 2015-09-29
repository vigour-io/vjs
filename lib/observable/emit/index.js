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
    var on = this.getProperty('on')
    var isProperty
    if (on) {
      isProperty = (on = on.base && on.base.getProperty(key)) && on.base
    }
    // should get default childconstructor settings not assume trigger as default
    return (!isProperty || isProperty.triggerEvent)
  },
  emit: function (key, data, event, ignore) {
    // maybe do this with a extend or use or something
    return _emit.call(this, data, event, this, key, ignore)
  },
  emitInternal: function (data, event, bind, key, trigger, ignore) {
    var context = this._context
    var on = this._on
    var emitter
    var property

    if (on) {
      property = on.getProperty(key)
      if (property && property.override) {
        key = property.override
      }
      emitter = on[key]
    }

    if (emitter && !ignore) {
      if (!(emitter instanceof Emitter)) {
        throw new Error('observable.emit - can only emit on emitters')
      }
      this.emitInstances(emitter, data, event)
      this.emitContext(emitter, data, event)
      emitter.emit(data, event, this)
      if (!context) {
        this.clearContext()
      }
    }
    return trigger
  }
}

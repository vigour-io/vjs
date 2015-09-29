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
    var isProperty = this.get(
      '_properties.on.base._properties.' + key + '.base'
    )
    // should get default childconstructor settings not assume trigger as default
    return (!isProperty || isProperty.triggerEvent)
  },
  emit: function (key, data, event, ignore) {
    // maybe do this with a extend or use or something
    return _emit.call(this, data, event, this, key, ignore)
  },
  emitInternal: function (data, event, bind, key, trigger, ignore) {
    var context = this._context
    var emitter = this._on && this._on[key]
    if (emitter && !ignore) {
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

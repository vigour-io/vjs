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
    return (!isProperty || isProperty.triggerEvent)
  },
  emit: function (key, event, meta, ignore) {
    return _emit.call(this, event, this, meta, key, ignore)
  },
  emitInternal: function (event, bind, meta, key, trigger, ignore) {
    var context = this._context
    var emitter = this._on && this._on[key]
    if (emitter && !ignore) {
      this.emitInstances(emitter, event)
      this.emitContext(emitter, event)
      emitter.emit(event, meta, this)
      if (!context) {
        this.clearContext()
      }
    }
    return trigger
  }
}

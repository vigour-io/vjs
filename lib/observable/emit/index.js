'use strict'
var Emitter = require('../../emitter')
var _emit = Emitter.prototype.emit

exports.inject = [
  require('../instances'),
  require('./instances'),
  require('./context'),
  require('../../emitter/emit')
]

exports.define = {
  emit: function (key, event, meta, ignore) {
    // hier komt meer reuse
    return _emit.call(this, event, this, meta, key, ignore)
  },
  emitInternal: function (event, bind, meta, key, trigger, ignore) {
    var context = this._context
    // make this part setting in emitter
    // can handle this whole block tehre allmost
    if (
      (trigger ||
      event.origin === this &&
      event.type === key) &&
      !event.isTriggered
    ) {
      // maak hier iets voor
      var isProperty = this.get(
        '_properties.on.base._properties.' + key + '.base'
      )
      if (!isProperty || isProperty.triggerEvent) {
        trigger = event.isTriggered = true
      }
      // also need to check if key is ok
    }

    var emitter = this._on && this._on[key]
    if (emitter && !ignore) {
      // these calls can go to emittet
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

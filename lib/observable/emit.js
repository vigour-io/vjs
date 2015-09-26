'use strict'
var emit = require('../emitter/emit').define.emit

exports.inject = [
  require('./instances'),
  require('./instances/emit'),
  require('./instances/context')
]

exports.define = {
  emitInternal: function (event, bind, meta, key, createdEvent, ignore) {
    var trigger
    var context = this._context

    if (
      (createdEvent ||
      event.origin === this &&
      event.type === key) &&
      !event.isTriggered
    ) {
      //maak hier iets voor
      var block
      var isProperty = this
        .get('_properties.on.base._properties.' + key + '.base')
      if (isProperty) {
        if(!isProperty.triggerEvent) {
          block = true
        }
      }
      if (!block) {
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
  },
  emit: function (key, event, meta, ignore) {
    return emit.call(this, event, this, meta, key, ignore)
  }
}

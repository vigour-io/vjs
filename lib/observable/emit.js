'use strict'
var emit = require('../emitter/emit').define.emit

exports.inject = [
  require('./instances'),
  require('./instances/emit'),
  require('./instances/context')
]

// beter opdelen laatste stuk
// trigger event

exports.define = {
  emitInternal: function (event, bind, meta, key, createdEvent) {
    var trigger
    var context = this._context
    if (
      (createdEvent ||
      event.origin === this &&
      event.type === key) &&
      !event.isTriggered
    ) {
      trigger = event.isTriggered = true
    }
    var emitter = this._on && this._on[key]
    if (emitter && this.ignoreEvent !== event.stamp) {
      // event, bind, meta, key, createdEvent
      // meta ff mee
      console.log('ok go go', emitter, this.path)
      this.emitInstances(emitter, event)
      this.emitContext(emitter, event)
      emitter.emit(event, meta, this)
      if (!context) {
        this.clearContext()
      }
    }
    this._ignoremyself = null
    return trigger
  },
  emit: function (key, event, meta, ignore) {
    if (ignore) {
      this.ignoreEvent = event.stamp
    }
    return emit.call(this, event, this, meta, key)
  }
}

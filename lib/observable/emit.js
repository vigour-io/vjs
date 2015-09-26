'use strict'
var emit = require('../emitter/emit').define.emit

exports.inject = [
  require('./instances'),
  require('./instances/emit'),
  require('./instances/context')
]

//beter opdelen laatste stuk
//trigger event

exports.define = {
  emitInternal: function (event, bind, meta, key, createdEvent) {
    var trigger
    if (
      (createdEvent ||
      event.origin === this &&
      event.type === key) &&
      !event.isTriggered
    ) {
      trigger = event.isTriggered = true
    }
    var emitter = this._on && this._on[key]
    if (emitter) {
      emitter.emit(event, meta, this)
    }
    return trigger
  },
  emit: function (key, event, meta) {
    return emit.call(this, event, this, meta, key)
  }
}

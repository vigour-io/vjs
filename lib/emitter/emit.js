'use strict'
var Event = require('../event')

exports.properties = {
  triggerEvent: { val: true }
}

exports.define = {
  emit: function (event, meta, bind, key, ignore) {
    var createdEvent
    if (event === false) {
      return
    }
    if (event === void 0) {
      if (ignore) {
        return
      }
      if (!key) {
        key = this.key
      }
      event = new Event(this, key)
      createdEvent = true
    }
    if (this.emitInternal(event, bind, meta, key, createdEvent, ignore)) {
      event.trigger()
    }
    return this
  },
  // returns if trigger needs to be calleed on event
  emitInternal: function (event, bind, meta, key, createdEvent, ignore) {
    // dit kan een stuk beter
    // kan ook doen dat emit hem inject (triggerEvent)
    var trigger
    if (!event.isTriggered && this.triggerEvent) {
      event.isTriggered = trigger = createdEvent
    }
    this.push(bind, event.push(this))
    return trigger
  }
}

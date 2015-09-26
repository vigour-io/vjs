'use strict'
var Event = require('../event')

exports.define = {
  emit: function (event, meta, bind, key) {
    var createdEvent

    if (event === false) {
      return
    }

    if (event === void 0) {
      if (!key) {
        key = this.key
      }
      console.warn('create event')
      event = new Event(this, key)
      createdEvent = true
    }

    if (this.emitInternal(event, bind, meta, key, createdEvent)) {
      console.log('trigger dat internal', this.path, event)
      event.trigger()
    }
    return this
  },
  // returns if trigger needs to be calleed on event
  emitInternal: function (event, bind, meta, key, createdEvent) {
    var trigger
    if (!event.isTriggered) {
      event.isTriggered = trigger = createdEvent && this.triggerEvent
    }
    console.log('\n\nXXXXXXXXX', bind)
    this.push(bind, event.push(this))

    return trigger
  }
}

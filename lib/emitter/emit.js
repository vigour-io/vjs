'use strict'
var Event = require('../event')

exports.properties = {
  triggerEvent: { val: true }
}

exports.define = {
  getTriggerEvent: function (key) {
    return this.triggerEvent
  },
  emit: function (event, meta, bind, key, ignore) {
    var trigger

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
      trigger = true
    }

    if (
      (trigger ||
      event.origin === this &&
      event.type === key &&
      event.context == this._context) &&
      !event.isTriggered
    ) {
      if (this.getTriggerEvent(key)) {
        trigger = event.isTriggered = true
      }
    }

    if (this.emitInternal(event, bind, meta, key, trigger, ignore)) {
      event.trigger()
    }

    return this
  },
  emitInternal: function (event, bind, meta, key, trigger, ignore) {
    this.push(bind, event.push(this))
    return trigger
  }
}

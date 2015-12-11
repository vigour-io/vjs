'use strict'
var Event = require('../event')
exports.properties = {
  triggerEvent: { val: true }
}

exports.define = {
  getTriggerEvent (key) {
    return this.triggerEvent
  },
  emit (data, event, bind, key, ignore) {
    // do last stamp check hier saves calls
    if (event === false) {
      return
    }
    let trigger

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
      !event.isTriggered &&
      (trigger ||
      event.origin === this &&
      event.type === key &&
      event.context == this._context) // eslint-disable-line
    ) {
      if (this.getTriggerEvent(key)) {
        trigger = event.isTriggered = true
      }
    }
    if (this.emitInternal(data, event, bind || this, key, trigger, ignore)) {
      event.trigger()
    }
    return this
  },
  emitInternal (data, event, bind, key, trigger, ignore) {
    this.push(bind, event.push(this), data)
    return trigger
  }
}

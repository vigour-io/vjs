'use strict'
var Event = require('../event')
exports.properties = {
  triggerEvent: { val: true }
}

// require('colors-browserify')
exports.define = {
  emit (data, event, bind, key, ignore) {
    // can be optimzied less checks!
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
      if (this.triggerEvent) {
        trigger = event.isTriggered = true
      }
    }
    if (this.emitInternal(data, event, bind || this, key, trigger, ignore)) {
      event.trigger()
    }
  },
  emitInternal (data, event, bind, key, trigger, ignore) {
    this.push(bind, event.push(this), data)
    return trigger
  }
}

'use strict'
var Event = require('../event')

exports.properties = {
  triggerEvent: { val: true },
  meta: true
}

exports.define = {
  getTriggerEvent: function (key) {
    return this.triggerEvent
  },
  emit: function (event, meta, bind, key, ignore) {
    // do last stamp check hier saves calls

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

    if (!this.meta && meta && this._properties.meta) {
      console.error(meta)
      this.meta = meta
    }

    if (
      !event.isTriggered &&
      (trigger ||
      event.origin === this &&
      event.type === key &&
      // JSstandard: want to use type coercion check here
      event.context == this._context)
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

'use strict'
var Emitter = require('../emitter')
var Event = require('../event')

exports.inject = require('./instances')

exports.define = {
  emit (key, data, event, ignore) {
    if (event === false) {
      return
    }
    let trigger
    if (event === void 0) {
      if (ignore) {
        return
      }
      event = new Event(this, key)
      trigger = true
    }
    if (!ignore) {
      let on = this._on
      if (on) {
        let override = on._properties._overrides[key]
        if (override) {
          key = override
        }
        let emitter = on[key]
        if (emitter) {
          emitter.emitInternal(data, event, this)
        }
      }
    }
    if (trigger) {
      event.trigger()
    }
  }
}

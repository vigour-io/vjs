'use strict'

var Emitter = require('../../emitter')
var _emit = Emitter.prototype.emit
var Event = require('../../event')

exports.inject = [
  require('../instances'),
  require('./instances'),
  require('./context')
]
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

    // this can also be a funciton that fine
    if (
      !event.isTriggered &&
      (trigger ||
      event.origin === this &&
      event.type === key && // look up prop faster
      event.context == this._context) // eslint-disable-line
    ) {
      let isProperty = this.getProperty('on', key, 'base')
      if (!isProperty || isProperty.triggerEvent) {
        trigger = event.isTriggered = true
      }
    }
    let on = this._on
    if (on) {
      let override = on.getProperty(key, 'override')
      if (override) {
        key = override
      }
      let emitter = on[key]
      if (!ignore) {
        if (emitter) {
          let context = this._context
          this.emitInstances(emitter, data, event, key)
          this.emitContext(emitter, data, event)
          // data, event, bind, key, trigger, ignore
          emitter.emitInternal(data, event, this, key, trigger, ignore)
          // emitter.push(this, event.push(emitter), data)
          // emitter.emit(data, event, this)
          if (!context) {
            this.clearContext()
          }
        } else {
          // this is a bit dirty and heavy!
          this.emitInstances(void 0, data, event, key)
        }
      }
    }
    if (trigger) {
      event.trigger()
    }
  }
}

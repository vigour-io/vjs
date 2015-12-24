'use strict'

var Emitter = require('../../emitter')
var _emit = Emitter.prototype.emit
var Event = require('../../event')

// context optmizations as well -- have to reduce amount of fires -- the ignore stuff can be optmized

exports.inject = [
  require('../instances'),
  require('./instances'),
  require('./context')
]

var overridemap = {

}

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

    if (
      !event.isTriggered &&
      (trigger ||
      event.origin === this &&
      event.type === key && // look up prop faster
      event.context == this._context) // eslint-disable-line
    ) {
      // let isProperty = this.getProperty('on', key, 'base')
      // same check map with props thats it
      // overrid map seperate
      // if (!isProperty || isProperty.triggerEvent) {
      trigger = event.isTriggered = true
      // }
    }
    let on = this._on
    if (on) {
      // this is a very slow way lets make it better
      let override = on._properties._overrides[key]
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

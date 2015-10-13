'use strict'
var Event = require('../event')

module.exports = function (emitter) {
  var Emitter = emitter.Constructor

  emitter.properties = {
    triggerEvent: { val: true }
  }

  emitter.define({
    getTriggerEvent (key) {
      return this.triggerEvent
    },
    // build a flavour thing flavour: { body: } is really nice to have
    // emit: { pre: , body, post } for exmple obs.flavour({emit: { body: fn }})
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
          this instanceof Emitter &&
          this.getData(event) === void 0 &&
          data !== void 0
        ) {
        this.storeData(event, data)
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
      if (this.emitInternal(data, event, bind, key, trigger, ignore)) {
        event.trigger()
      }
      return this
    },
    emitInternal (data, event, bind, key, trigger, ignore) {
      this.push(bind, event.push(this))
      return trigger
    }
  })
}

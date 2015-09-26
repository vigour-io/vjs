'use strict'
var Event = require('../event')

exports.define = {
  emit: function (event, bind, meta) {
    var trigger
    if (event === void 0) {
      trigger = true
      event = new Event(this, this.key)
      event.isTriggered = true
    }

    console.log('?')
    console.log('??make??')

    this.emitInternal.apply(this, arguments)

    if (trigger) {
      event.trigger()
    }
  }
}

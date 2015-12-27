'use strict'
var Event = require('../event')
exports.define = {
  emit (data, event, bind) {
    if (event === false) {
      return
    }
    let trigger
    if (event === void 0) {
      event = new Event(this, this.key)
      trigger = true
    }
    this.emitInternal(data, event, bind)
    if (trigger) {
      event.trigger()
    }
  },
  emitInternal (data, event, bind) {
    // can be greatly optmized check if nessecary e.g. overwrites and if only listener
    // maybe even do -- if created don emit internal?
    // like block emitter when something is written on it (simple set uid:null) or something simmilair
    this.emitting && event.push(this, bind, data)
  }
}

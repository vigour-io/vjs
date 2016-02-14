'use strict'
var Event = require('../event')
exports.define = {
  emit (data, event, bind) {
    if (event === false) {
      return
    }
    let trigger
    if (event === void 0) {
      event = new Event(this.key)
      trigger = true
    }
    // global.uids[bind.uid] = this
    this.emitInternal(data, event, bind)
    if (trigger) {
      event.trigger()
    }
  },
  emitInternal (data, event, bind) {
    if (!event || !event.push) {
      console.error('no EVENT WTF?????', this.path, event, data, bind, bind.path)
      return
    }
    this.storeData(data, event, bind)
    this.emitting && event.push(this, bind, data)
  }
}

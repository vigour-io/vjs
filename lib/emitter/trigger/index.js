'use strict'
var execattach = require('./attach')
var isNumberLike = require('../../util/is/numberlike')

exports.define = {
  isExecutable (property, key, base, stamp) {
    return !base._properties[key]
  },
  execInternal (bind, event, data) {
    var emitter = this
    var stamp = event.stamp
    if (emitter.base) {
      let type = emitter.key
      emitter.base.each(function (property) {
        property.emit(type, data, event)
      }, emitter.isExecutable, stamp)
    }
    var original = bind
    bind = bind.getBind()
    if (bind) {
      if (emitter.fn) {
        emitter.fn.each(function (property, key) {
          property.call(bind, data, event, original)
        }, emitter.isExecutable, stamp)
      }
      if (emitter.attach) {
        emitter.attach.each(function (property) {
          execattach(property, bind, event, emitter, data)
        }, emitter.isExecutable, stamp)
      }
    }
  },
  trigger: require('./method')
  // (binds, event) {
  //   // move trigger internal into this -- no split!
  //   // if (this.condition && event.condition !== this.condition) {
  //     // this.condition.trigger(event)
  //   // } else {
  //     trigger.call(this, binds, event)
  //   // }
  // }
}

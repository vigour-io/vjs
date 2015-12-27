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

    // newParent: function (parent, event) { <--- replace this piece of crap
    //   // if (this.data && this.data.base) {
    //   //   parent.set({ on: { data: {} } }, false, true)
    //   //   parent._on.data.removeProperty(parent._on.data.base, 'base')
    //   // }
    // },

    // this check can be more efficient
    if (emitter.hasOwnProperty('base') && !bind._context) {
      let type = emitter.key
      emitter.base.each(function (property) {
        property.emit(type, data, event)
      }, function (property, key, base, stamp) {
        return !base._properties[key] && base.hasOwnProperty(key)
      }, stamp)
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

'use strict'
var execattach = require('./attach')
var triggerBind = require('./bind')

exports.define = {
  isExecutable (property, key, base, stamp) {
    return !base._properties[key]
  },
  execInternal (bind, event, data) {
    var emitter = this
    var stamp = event.stamp
    if (emitter.hasOwnProperty('base') && !bind._context) {
      let type = emitter.key
      emitter.base.each(function (property) {
        property._on[type].trigger({ p: property }, event, data)
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
  trigger (binds, event) {
    if (binds) {
      for (let uid in binds) {
        if (uid !== 'val') {
          let bind = binds[uid]
          let data
          triggerBind(this, bind, event, data)
        }
      }
    }
  }
}

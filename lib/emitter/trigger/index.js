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
    if (!bind._context) {
      // *** CLEAN UP MAYBE GET SPEED BY JUST DOING THIS IN FUNCTION MAKE NICER ANYWAYS ***
      let type = emitter.key
      let on = (!bind.__on && bind._on) || bind.hasOwnProperty('__on') && bind.__on
      if (on && on.hasOwnProperty(type) && on[type].hasOwnProperty('base')) {
        emitter.base.each(function (property) {
          triggerBind(property._on[type], property, event, data)
        }, function (property, key, base, stamp) {
          return !base._properties[key] && base.hasOwnProperty(key) && property._on && property._on[type]
        }, stamp)
      }
    }

    // *** CANDITATE FOR MURDER! ***
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

'use strict'
var trigger = require('./method')
var execattach = require('./attach')

exports.define = {
  isExecutable: function (property, key, base, stamp) {
    // why do I need this property check
    var ignore = property && property._ignoreStamp
    if (ignore) {
      if (ignore === stamp) {
        return
      } else {
        property._ignoreStamp = null
        return !base._properties[key]
      }
    } else {
      return !base._properties[key]
    }
  },
  execInternal (bind, event) {
    var emitter = this
    var stamp = event.stamp
    var data = emitter.getData(event, bind)

    if (emitter.base) {
      var type = emitter.key
      emitter.base.each(function (property) {
        property.emit(type, data, event)
      }, emitter.isExecutable, stamp)
    }

    if (emitter.setListeners) {
      emitter.setListeners.each(function (property) {
        bind.set(property, event)
      }, emitter.isExecutable, stamp)
    }
    var original = bind
    bind = bind.getBind() // not rly sure about this one
    if (bind) {
      // set bind call using bind
      if (emitter.fn) {
        emitter.fn.each(function (property, key) {
          property.call(bind, data, event, original)
        }, emitter.isExecutable, stamp)
      }

      if (emitter.attach) {
        emitter.attach.each(function (property) {
          // original
          execattach(property, bind, event, emitter, data)
        }, emitter.isExecutable, stamp)
      }
    // think of a storage name setListeners is a bit off
    }
  },
  trigger (event) {
    // laststamp make it work for multiple events at the same time
    if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
      if (this.condition && event.condition !== this.condition) {
        this.condition.trigger(event)
      } else {
        trigger.call(this, event)
      }
    }
  }
}

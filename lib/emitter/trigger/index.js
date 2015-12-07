'use strict'
var trigger = require('./method')
var execattach = require('./attach')

exports.define = {
  isExecutable (property, key, base, stamp) {
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
  execInternal (bind, event, data) {
    var emitter = this
    var stamp = event.stamp

    console.log('exec internal!', event.stamp, data)

    if (emitter.base) {
      var type = emitter.key
      emitter.base.each(function (property) {
        if (property.lastStamp === event.stamp) {

        } else {
          property.lastStamp = event.stamp
          // console.warn('---- base emit it!', event.queue.length)
          // console.log(Object.keys(emitter.binds[event.stamp]), event.stamp)
          property.emit(type, data, event)
          // console.log('2 --- base emit it!')
          // for (var xi in emitter.binds[event.stamp]) {
          //   console.log(xi, emitter.binds[event.stamp][xi])
          // }
          // console.warn(Object.keys(emitter.binds[event.stamp]))
        }
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
          // original -- also add guard here i geuss...
          execattach(property, bind, event, emitter, data)
        }, emitter.isExecutable, stamp)
      }
    // think of a storage name setListeners is a bit off
    }
  },
  trigger (event) {
    // if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
    if (this.condition && event.condition !== this.condition) {
      this.condition.trigger(event)
    } else {
      trigger.call(this, event)
    }
    // }
  }
}

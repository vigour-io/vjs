'use strict'
var trigger = require('./method')
var execattach = require('./attach')
var isNumberLike = require('../../util/is/numberlike')

exports.define = {
  isExecutable (property, key, base, stamp) {
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
    if (emitter.base) {
      var type = emitter.key
      emitter.base.each(function (property) {
        // has to be send -- info is not ok now! -- laststamp is the thing
        if (property.lastStamp === event.stamp) {

        } else {
          property.lastStamp = event.stamp
          property.clearContext()
          // extra arg ? over reference may make things faster for subscription
          property.emit(type, data, event)
        }
      }, emitter.isExecutable, stamp)
    }
    if (emitter.setListeners) {
      emitter.setListeners.each(function (property) {
        bind.set(property, event)
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
  trigger (event) {
    if (this.condition && event.condition !== this.condition) {
      this.condition.trigger(event)
    } else {
      trigger.call(this, event)
    }
  },
  triggerContext (bound, event, data, i) {
    for (let j in bound) {
      if (isNumberLike(j)) {
        if (bound[j].chain) {
          let bind = this.setContextChain(bound[j].chain)
          this.execInternal(bind, event, data)
          delete bound[j].chain
        }
        this.triggerContext(bound[j], event, data)
      }
    }
  }
}

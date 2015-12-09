'use strict'
var trigger = require('./method')
var execattach = require('./attach')
var isNumberLike = require('../../util/is/numberlike')

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

    if (emitter.base) {
      var type = emitter.key
      emitter.base.each(function (property) {
        if (property.lastStamp === event.stamp) {

        } else {
          // this needs refactor
          property.lastStamp = event.stamp
          // make option to pass on events to base automaticly
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
    // needs something like this -- refactor! need to get the event from .binds (own prop etc)
    // if (this.lastStamp !== event.stamp || !this.hasOwnProperty('lastStamp')) {
    console.log('trigger (emitter/trigger) -- binds --> stamp:'.magenta.bold, '  -->', !!event.condition, event.stamp, '---', this.path)

    if (this.condition && event.condition !== this.condition) {
      console.log('   condition trigger'.blue.bold)
      this.condition.trigger(event)
    } else {
      console.log('   real trigger'.grey.bold)
      trigger.call(this, event)
    }
    // }
  },
  triggerContext (bound, event, data, i) {
    for (let j in bound) {
      console.log('trigger it!', j)
      if (isNumberLike(j)) {
        console.log('context:', i, '-->', j)
        if (bound[j].chain) {
          console.log('go go go!')
          let bind = this.setContextChain(bound[j].chain)
          this.execInternal(bind, event, data)
          // console.error('Remove context', this.path)
          delete bound[j].chain
        }
        this.triggerContext(bound[j], event, data)
      }
    }
  }
}

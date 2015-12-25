'use strict'
var Base = require('../base')
var Event = require('../event')
function DataEvent () {
  Event.apply(this, arguments)
}
DataEvent.prototype = new Event()
DataEvent.prototype.type = 'data'
var proto = Base.prototype
var set = proto.set
var addNewProperty = proto.addNewProperty
var stream = require('./stream/shared')
// var setStream = stream.setStream
// var removeStream = stream.removeStream

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    setValueInternal (val, event) {
      var oldVal = this._input
      this._input = val
      var valIsObservable = val instanceof Observable
      if (valIsObservable) {
        this._input = val.on('data', this, void 0, void 0, event)
        // if (this._on && this._on.reference) {
          // make a system where you just pass the emitter saves checks
        this.emit('reference', oldVal, event)
        // }
      }
      if (oldVal instanceof Observable) {
        oldVal.off('data', { base: this })
        if (!valIsObservable) {
          // if (this._on && this._on.reference) {
          this.emit('reference', oldVal, event)
          // }
        }
      }
      // if (this._on && this._on.value) {
      this.emit('value', val, event)
      // }
      return this
    },
    set (val, event, nocontext, escape) {
      var trigger
      if (event === void 0) {
        // use perdefined data event
        event = new DataEvent(this)
        event.isTriggered = trigger = true
      }
      var base = set.call(this, val, event, nocontext, escape)
      // @todo: how to do this in emitter since its just an event that starts from an orignator
      if (event) {
        if (!base) {
          this.emit('data', val, event, true)
        } else {
          base.emit('data', val, event)
        }
        if (trigger) {
          event.trigger()
        }
      }
      return base
    },
    addNewProperty (key, val, property, event, escape) {
      // be carefull with useval
      var fireParentEvent = !this[key] || (val && val.useVal)
      addNewProperty.call(this, key, val, property, event, escape)
      if (event) {
        this.emit('property', key, event)
      }
      if (fireParentEvent && this[key] instanceof Observable) {
        this[key].emit('parent', this, event)
      }
    }
  })
}

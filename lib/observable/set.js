'use strict'
var Base = require('../base')
var Event = require('../event')
var proto = Base.prototype
var set = proto.set
var addNewProperty = proto.addNewProperty
var stream = require('./stream/shared')
var setStream = stream.setStream
var removeStream = stream.removeStream

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    setValueInternal (val, event) {
      var oldVal = this._input
      this._input = val
      var valIsObservable = val instanceof Observable
      // types - more types //make this a seperate methods
      if (valIsObservable) {
        this._input = val.on('data', this, void 0, void 0, event)
        // reference data is the previous value thats a good thing!
        this.emit('reference', oldVal, event)
      } else {
        // make part of proto of obs -- move it
        setStream(val, this)
      }
      if (oldVal instanceof Observable) {
        oldVal.off('data', { base: this })
        if (!valIsObservable) {
          this.emit('reference', oldVal, event)
        }
      } else {
        removeStream(oldVal, this) // has to be added to remove as well!
      }
      this.emit('value', val, event)
      return this
    },
    set (val, event, nocontext, escape) {
      var trigger
      if (event === void 0) {
        event = new Event(this, 'data')
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

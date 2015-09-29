'use strict'
var Base = require('../base')
var Event = require('../event')
var proto = Base.prototype
var set = proto.set
var addNewProperty = proto.addNewProperty
var ReadableStream = require('stream').Readable
var DuplexStream = require('stream').Duplex
var stream = require('./stream/shared')
var setStream = stream.setStream
var removeStream = stream.removeStream

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    setValueInternal: function (val, event) {
      var oldVal = this._input
      this._input = val
      var valIsObservable = val instanceof Observable
      // types - more types //make this a seperate methods
      if (valIsObservable) {
        this._input = val.on('data', this, void 0, void 0, event)
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
        removeStream(oldVal, this)
      }
      this.emit('value', val, event)
      return this
    },
    set: function (val, event, nocontext) {
      if (event === void 0) {
        event = new Event(this, 'data')
      }
      var base = set.call(this, val, event, nocontext)
      // TODO: how to do this in emitter since its just an event that starts from an orignator
      if (event) {
        if (!base) {
          this.emit('data', val, event, true)
        } else {
          base.emit('data', val, event)
        }
      }
      return base
    },
    addNewProperty: function (key, val, property, event) {
      var fireParentEvent = !this[key]
      addNewProperty.call(this, key, val, property, event)
      if (event) {
        this.emit('property', key, event)
      }
      if (fireParentEvent && this[key] instanceof Observable) {
        this[key].emit('addToParent', this, event || void 0) // event
      }
    }
  })
}

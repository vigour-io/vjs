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
      // TODO: optmize!!!
      var oldVal = this._input
      var valIsObservable = val instanceof Observable
      this._input = val

      if (valIsObservable) {
        this._input = val.on('change', this, void 0, void 0, event)
        this.emit('reference', event, oldVal)
      } else if (val instanceof ReadableStream || val instanceof DuplexStream) {
        // make part of proto of obs -- move it
        setStream(val, this)
      }

      if (oldVal instanceof Observable) {
        oldVal.off('change', { base: this })
        if (!valIsObservable) {
          this.emit('reference', event, oldVal)
        }
      } else {
        removeStream(oldVal, this)
      }
      this.emit('value', event, val)
      return this
    },
    set: function (val, event, nocontext) {
      if (event === void 0) {
        event = new Event(this, 'change')
      }
      var base = set.call(this, val, event, nocontext)
      // TODO: how to do this in emitter since its just an event that starts from an orignator
      if (event) {
        console.log('SET', val)
        if (!base) {
          this.emit('change', event, val, true)
        } else {
          base.emit('change', event, val)
        }
      }
      return base
    },
    addNewProperty: function (key, val, property, event) {
      var fireParentEvent = !this[key]
      addNewProperty.call(this, key, val, property, event)
      if (event) {
        this.emit('property', event, key)
      }
      if (fireParentEvent && this[key] instanceof Observable) {
        this[key].emit('addToParent', event || void 0) // event
      }
    }
  })
}

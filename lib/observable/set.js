'use strict'
var Base = require('../base')
var Event = require('./events').Data
var proto = Base.prototype
var set = proto.set
var addNewProperty = proto.addNewProperty

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    setValueInternal (val, event) {
      var oldVal = this._input
      this._input = val
      var valIsObservable = val instanceof Observable
      if (valIsObservable) {
        this._input = val.on('data', this, void 0, void 0, event)

        this.emit('reference', oldVal, event)
      }
      if (oldVal instanceof Observable) {
        // this is super slow ofcourse make more specific thing for this!
        // or use own off
        oldVal.off('data', { base: this })
        if (!valIsObservable) {
          this.emit('reference', oldVal, event)
        }
      }
      // oldval is better to send here!
      this.emit('value', val, event)
      return this
    },
    set (val, event, nocontext, escape) {
      var trigger
      if (event === void 0) {
        trigger = true
        event = new Event()
      }
      var base = set.call(this, val, event, nocontext, escape)
      // maybe something with the g doc fucked up
      if (event) {
        if (!base) {
          // somehwere here it removes godamn input thats just ridiculous!
          this.emit('data', val, event, true)
        } else {
          // make specific as well
          base.emit('data', val, event)
        }
        if (trigger) {
          event.trigger()
        }
      }
      return base
    },
    addNewProperty (key, val, property, event, escape) {
      console.log('YO!', key)
      var fireParentEvent = !this[key] || (val && val.useVal)
      addNewProperty.call(this, key, val, property, event, escape)
      if (event) {
        this.emit('property', key, event)
      }
      if (fireParentEvent && this[key] instanceof Observable) {
        // can be leading as well!
        this[key].emit('parent', this, event)
      }
    }
  })
}

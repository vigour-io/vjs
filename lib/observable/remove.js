'use strict'
var Base = require('../base')
var Event = require('../event')
Event.prototype.inject(require('../event/toString'))
// var removeStream = require('./stream/shared').removeStream
// var remove = Base.prototype.remove
// var removeUpdateParent = proto.removeUpdateParent

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    emitRemove: function (event, make) {
      // add references
      if (this._input === null) {
        // console.warn('allready nulled input', this._input)
        return
      }
      if (!this._context) {
        this._input = null
      }

      // add streams, value, reference listeners
      if (event) {
        // emit without trigger should be an option!
        if (!make) {
          this.emit('change', event, null)
        }
      }
      if (this._parent) {
        // console.log(this._path)
        //getting .parent resolves context
        this.parent.emit('property', event, this.key)
        // console.log('PARENT----->', event.toString(), !!this._context)
        // if(!this._context) {
        this.parent.emit('change', event)
        // }
      }
      this.each(
        function (property) {
          property.emitRemove(event)
        },
        function (property) {
          return !(property instanceof Observable)
        }
      )
    },
    remove: function (event, nocontext, noparent) {
      console.warn('CONTEXT:', this._context)

      var make
      // var context = this._context

      if (event === void 0) {
        event = new Event(this, 'change')

        // make a really nice option for this!
        event.isTriggered = true
        make = true
        // now need to make it easy to say this is triggered by me
        // e.g. event.isTriggered = true something like that
      }
      if (event) {
        console.warn(!!this._context)
        this.emitRemove(event, make)
        console.warn(!!this._context)

      }
      // console.log(event.toString())

      if (event && make) {
        // console.log('----->', event.toString())
        // emit without trigger should be an option!
        event.isTriggered = null
        console.error('EMIT IT', event.toString(), this._instances, this.path)
        this.emit('change', event, null)
      }
      this.removeFromInstances(event)
      return Base.prototype.remove.call(this, event, nocontext, noparent)
    }
  })
}

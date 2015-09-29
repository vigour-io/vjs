'use strict'
var Base = require('../base')
var Event = require('../event')
var removeStream = require('./stream/shared').removeStream
var removeInternal = Base.prototype.removeInternal
Event.prototype.inject(require('../event/toString'))

// support utils . inherits
// needs optmizations -- nesed should not go into emit twice
module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    emitRemove: function (event, trigger, fromRemove) {
      // add references
      if (this._input === null) {
        console.warn('allready nulled input', this._input)
        return
      }


      if (!this._context) {
        var ref
        if (this._input instanceof Observable) {
          ref = this._input
        }
        this._input = null
        if (ref) {
          this.emit('reference', ref, event)
        }
      }

      if (event) {
        if (!trigger) {
          this.emit('remove', null, event)
          this.emit('data', null, event)
        }
      }

      if (this._parent) {
        // getting .parent vs ._parent resolves context
        this.parent.emit('property', this.key, event)
        if (!fromRemove) {
          this.parent.emit('data', void 0, event)
        }
      }

      this.each(
        function (property) {
          property.emitRemove(event, void 0, true)
        },
        function (property) {
          return !(property instanceof Observable)
        }
      )
    },
    remove: function (event, nocontext, noparent) {
      var trigger
      if (event === void 0) {
        event = new Event(this, 'data')
        // make a really nice option for this!
        event.isTriggered = true
        trigger = true
        // now need to make it easy to say this is triggered by me
        // e.g. event.isTriggered = true something like that
      }

      // todo: add stream removal
      // removeStream(this)

      // nu voor props niet emitten
      if (event) {
        // not for nested removes that would not make sense (remove props)
        // else you get way yo nested shit
        this.emitRemove(event, trigger)
      }

      if (event && trigger) {
        event.isTriggered = null
        this.emit('remove', null, event)
        this.emit('data', null, event)
        // this is where it gets execute if im the excutioner
      }

      this.removeFromInstances(event)
      // event is allready done so can be false
      // this means all event stuff can be removed from remove
      return Base.prototype.remove.call(this, false, nocontext, noparent)
    }
  })
}

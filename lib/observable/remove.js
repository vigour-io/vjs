'use strict'
var Base = require('../base')
var Event = require('../event')
// var removeStream = require('./stream/shared').removeStream
// var removeInternal = Base.prototype.removeInternal
Event.prototype.inject(require('../event/toString'))

// support utils . inherits
// needs optmizations -- nesed should not go into emit twice
module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    // temp fix
    contextRemove (key, event) {
      this[key].emitRemove(event)
      this[key] = null
      return this
    },
    emitRemove (event, trigger, fromRemove) {
      // add references
      if (this._input === null) {
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
          // console.log('go do it', this._path.join('.'))
          this.emit('remove', null, event)
          // no last stamp makes htis totally fucked
          // console.log('do it DATAX!!'.blue)

          this.emit('data', null, event)
        }
      }

      if (this._parent && this._parent instanceof Observable) {
        // getting .parent vs ._parent resolves context
        this.parent.emit('property', this.key, event)
        if (!fromRemove) {
          // console.log('!fromRemove', this._path)
          this.parent.emit('data', void 0, event)
        }
      }

      this.each(
        function (property) {
          property.emitRemove(event, void 0, true)
        },
        function (property) {
          return (property instanceof Observable)
        }
      )
    },
    remove (event, nocontext, noparent, trigger) {
      if (event === void 0) {
        event = new Event(this, 'data')
        event.isTriggered = true
        trigger = true
      }

      if (event) {
        this.emitRemove(event, trigger)
      }

      if (event && trigger) {
        event.isTriggered = null
        this.emit('remove', null, event)
        this.emit('data', null, event)
      } else if (event && !event.removed) {
        if (this._on) {
          // console.log(this._path.join('.'))
          // if (this._on.reference) {
          //   this._on.reference.execInternal(this, event, null)
          // }
          if (this._on.data) {
            this._on.data.execInternal(this, event, null)
            // for each based
          }
        }
      }

      this.removeFromInstances(event)
      return Base.prototype.remove.call(this, false, nocontext, noparent)
    }
  })
}

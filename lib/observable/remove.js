'use strict'
var Base = require('../base')
var Event = require('../event')
var removeStream = require('./stream/shared').removeStream
var proto = Base.prototype
var removeUpdateParent = proto.removeUpdateParent

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    emitRemoveProperties: function (event) {
      if (
        !this.hasOwnProperty('_removeStamp') ||
        this._removeStamp !== event.stamp
      ) {
        this._removeStamp = event.stamp
        // TODO: very slow optmize later!
        for (var key$ in this) {
          // better to ignore the normal ones
          if (
            key$ !== '_input' &&
            this[key$] instanceof Observable &&
            key$ !== '_parent'
          ) {
            this[key$].emitRemoveProperties(event)
          }
        }
        var refUpdate
        if (this._input instanceof Observable) {
          refUpdate = this._input
        }
        this._input = null
        if (refUpdate) {
          this.emit('reference', event, refUpdate)
        }
        this.emit('change', event, true)
      }
    },
    removeUpdateParent: function (parent, event, context, ignore) {
      if (!ignore) {
        emitParentRemoval(parent, this.key, event)
      }
      removeUpdateParent.call(this, parent, event, context)
    },
    removeInternal: function (event, nocontext, noparent) {
      if (event === void 0) {
        event = new Event(this, 'change')
        event.val = null
      }
      // can ignore some other stuff
      removeStream(this._input, this)
      var parent = this.parent
      if (!noparent && !nocontext && this._context) {
        this.removeFromInstances(event)
        emitParentRemoval(parent, this.key, event)
        if (event) {
          this.emit('change', event, true)
        }
        var ret = this.removeUpdateParent(this.parent, event, this._context, true)
        return ret
      } else {
        if (!noparent && parent) {
          emitParentRemoval(parent, this.key, event)
        }
        if (event) {
          this.emitRemoveProperties(event)
          this.removeFromInstances(event)
        }
        if (!noparent && parent) {
          this.removeUpdateParent(parent, event, false, true)
        }
        this.removeProperties(event, nocontext, noparent)
      }
      return this
    }
  })
}

function emitParentRemoval (parent, key, event) {
  // console.error('ok this is weird?', parent.$key, parent.$path)
  parent.emit('change', event)
  parent.emit('property', event, void 0, key)
}

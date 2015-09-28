'use strict'
var Base = require('../base')
var Event = require('../event')
// var removeStream = require('./stream/shared').removeStream
// var remove = Base.prototype.remove
// var removeUpdateParent = proto.removeUpdateParent

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    emitRemove: function (event) {
      // add references
      if (this._input === null) {
        console.warn('allready nulled input', this._input)
        return
      }
      this._input = null

      // add streams, value, reference listeners

      if (this._parent) {
        this._parent.emit('property', event, this.key)
        this._parent.emit('change', event)
      }
      this.each(
        function (property) {
          property.emitRemove(event)
        },
        function (property) {
          return !(property instanceof Observable)
        }
      )
      if (event) {
        this.emit('change', event, null)
      }
    },
    remove: function (event, nocontext, noparent) {
      if (event === void 0) {
        event = new Event(this, 'change')
      }
      if (event) {
        this.emitRemove(event)
      }
      return Base.prototype.remove.call(this, event, nocontext, noparent)
    }
  })
}

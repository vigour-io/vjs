'use strict'
var Base = require('../base')
var Event = require('../event')
var _remove = Base.prototype.remove

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
          this.emit('remove', null, event)
          this.emit('data', null, event)
        }
      }

      if (this._parent && this._parent instanceof Observable) {
        let parent = this.parent
        parent.emit('property', this.key, event)
        if (!fromRemove) {
          parent.emit('data', void 0, event)
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
        this.emitRemove(event, trigger, void 0)
        if (trigger) {
          event.isTriggered = null
          this.emit('remove', null, event)
          this.emit('data', null, event)
          this.removeFromInstances(event)
          return _remove.call(this, false, nocontext, noparent)
        } else {
          // let stored
          let _this = this
          if (_this._context) {
            // can become a lot faster (e.g. by using null as a set)
            _this = _this.resolveContext({}, event, this._context)
          }
          event.on('close', () => {
            _this.removeFromInstances(event)
            _remove.call(_this, false, nocontext, noparent)
          })
          return this
        }
      } else {
        // console.log('REMOVES!', this.path, number)
        this.removeFromInstances(event)
        return _remove.call(this, false, nocontext, noparent)
      }
    }
  })
}

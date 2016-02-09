'use strict'
var Base = require('../base')
var DataEvent = require('./events').Data
var _remove = Base.prototype.remove

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    contextRemove (key, event) {
      if (event) {
        this[key].emitRemove(event)
        event.on('close', function () {
          this[key] = null
        })
      } else {
        this[key] = null
      }
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
    remove (event, nocontext, noparent) {
      var trigger
      var _this = this
      if (_this._context) {
        console.log('go here?')
        _this = _this.resolveContext({}, event, this._context)
        if (!_this) {
          throw new Error('resolve in remove did not return a _this WRONG!')
        }
        // weird that this happens -- should allways resolve?
      }

      if (event === void 0) {
        event = new DataEvent(this)
        trigger = true
      }
      if (event) {

        _this.emitRemove(event, trigger, void 0)
        if (trigger) {
          _this.emit('remove', null, event)
          _this.emit('data', null, event)
          event.trigger()
          _this.removeFromInstances(event)
          return _remove.call(_this, false, nocontext, noparent)
        } else {
          event.on('close', function () {
            _this.removeFromInstances(event)
            _remove.call(_this, false, nocontext, noparent)
          })
          return _this
        }
      } else {
        _this.removeFromInstances(event)
        return _remove.call(_this, false, nocontext, noparent)
      }
    }
  })
}

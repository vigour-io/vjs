'use strict'
var Base = require('../base')
var DataEvent = require('./events').Data
var _remove = Base.prototype.remove

module.exports = function (observable) {
  var Observable = observable.Constructor
  observable.define({
    // temp fix
    contextRemove (key, event) {
      //// console.log('bitch drank')
      if (event) {
        this[key].emitRemove(event)
        event.on('close', function () {
          this[key] = null
        })
      }
      return this
    },
    emitRemove (event, trigger, fromRemove) {
      //console.warn('emit remove!', this._path)
      if (this._input === null) {
        return
      }

      // console.warn('emit remove!???', this._path)
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
      // console.log('obs remove!', this._path)
      var trigger
      if (event === void 0) {
        event = new DataEvent(this)
        trigger = true
      }
      if (event) {
        this.emitRemove(event, trigger, void 0)
        if (trigger) {
          this.emit('remove', null, event)
          this.emit('data', null, event)
          event.trigger()
          this.removeFromInstances(event)
          return _remove.call(this, false, nocontext, noparent)
        } else {
          // let stored
          let _this = this
          if (_this._context) {
            _this = _this.resolveContext({}, event, this._context)
          }
          event.on('close', () => {
            _this.removeFromInstances(event)
            _remove.call(_this, false, nocontext, noparent)
          })
          return this
        }
      } else {
        this.removeFromInstances(event)
        return _remove.call(this, false, nocontext, noparent)
      }
    }
  })
}

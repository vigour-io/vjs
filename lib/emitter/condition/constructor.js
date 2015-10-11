'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove
var Event = require('../../event')

module.exports = new Base({
  key: 'condition',
  properties: {
    inProgress: true,
    cancel: function () {
      console.error('cancel')
    }
  },
  define: {
    bind:function() {
      return this.parent.parent.parent
      // for operators
    },
    trigger: function (event) {
      if (!this.inProgress) {
        var obs = this.parent.parent.parent
        var deferEvent
        deferEvent = new Event(this.parent)
        deferEvent.isTriggered = true
        deferEvent.push(this.parent)
        for (var stamp in this.parent.binds) {
          if (stamp == event.stamp) {
            this.parent.binds[deferEvent.stamp] = this.parent.binds[event.stamp]
            delete this.parent.binds[event.stamp]
          }
        }
        deferEvent.condition = this
        this.inProgress = deferEvent
        var _this = this
        var val = obs.val
        this._input.call(obs, val, function done (cancel) {
          if (cancel) {
            _this.cancel(cancel)
          } else {
            deferEvent.trigger()
          }
          _this.inProgress = null
        }, deferEvent)
      } else {
        // option batch -- for now remove inprogress
      }
    },
    remove: function () {
      this.cancel()
      return remove.apply(this, arguments)
    },
    cancel: function (data) {
      if (data instanceof Error) {
        this.parent.parent.parent.emit('error', data)
      }
      // is this correct???
      this.parent.binds = null
      this.parent.contextsBinds = null
      this.inProgress.clear()
    }
  }
}).Constructor

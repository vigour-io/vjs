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
    bind: function () {
      return this.parent.parent.parent
      // for operators
    },
    trigger: function (event) {
      var eventStamp = event.stamp

      // batch options if in progress clear all
      // cancel option based on event stamp

      if (!this.inProgress || !this.inProgress[eventStamp]) {
        let emitter = this._parent
        let obs = this.parent.parent.parent
        let conditionEvent
        conditionEvent = new Event(this.parent)
        conditionEvent.isTriggered = true
        conditionEvent.isCondition = true
        conditionEvent.push(this.parent)
        //make strat for cancelations
        for (let stamp in this.parent.binds) {
          if (stamp == eventStamp) {
            emitter.binds[conditionEvent.stamp] = emitter.binds[eventStamp]
            emitter.storeData(conditionEvent, emitter.data[eventStamp])
            emitter.removeDataStorage(event)
            delete this.parent.binds[eventStamp]
          }
        }
        conditionEvent.condition = this
        if (!this.inProgress) {
          this.inProgress = {} //deferEvent
        }
        this.inProgress[eventStamp] = conditionEvent
        let _this = this
        let val = obs.val
        this._input.call(obs, val, function done (cancel) {
          if (cancel) {
            _this.cancel(cancel, event)
          } else {
            conditionEvent.trigger()
          }
          _this.inProgress = null
        }, conditionEvent)
      }
    },
    remove: function () {
      this.cancel()
      return remove.apply(this, arguments)
    },
    cancel: function (data, event) {
      if (data instanceof Error) {
        //use bind!
        this.getBind().emit('error', data)
      }
      // is this correct???
      // only null
      if (event) {
        console.error('OK GOT EVENT NOW ONLY DO FOR THIS EVENT!')
        // this.parent.binds = null
        // this.parent.contextsBinds = null
      } else {
        this.parent.binds = null
        this.parent.contextsBinds = null
        for (var key in this.inProgress) {
          this.inProgress[key].clear()
        }
      }
      // all cleared or just the one?
      // this.inProgress.clear()
    }
  }
}).Constructor

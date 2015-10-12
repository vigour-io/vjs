'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove
var Event = require('../../event')

module.exports = new Base({
  key: 'condition',
  ignoreInput: true,
  properties: {
    inProgress: true,
    cancel: function () {
      console.error('cancel')
    }
  },
  define: {
    bind: function () {
      return this.parent.parent.parent
      // for operators -- lets use the bind of the guy where using
      // for emitters its fine as well --- bit dangerous though :/
    },
    trigger: function (event) {
      var eventStamp = event.stamp
      // batch options if in progress clear all
      // cancel option based on event stamp
      // here we have to take instances and context into account
      if (!this.inProgress || !this.inProgress[eventStamp]) {
        let bind = this.getBind()
        let val = this.parseValue(bind.parseValue(void 0, void 0, void 0, 0))
        if (val === false) {
          console.warn('val is false by default this will not execute the condition', val)
        } else {
          let conditionEvent
          conditionEvent = new Event(this.parent)
          conditionEvent.isTriggered = true
          conditionEvent.isCondition = true
          conditionEvent.push(this.parent)
          // make start for cancelations
          let emitter = this._parent
          for (let stamp in this.parent.binds) {
            if (stamp == eventStamp && emitter.binds) { // eslint-disable-line
              emitter.binds[conditionEvent.stamp] = emitter.binds[eventStamp]
              emitter.storeData(conditionEvent, emitter.data[eventStamp])
              emitter.removeDataStorage(event)
              delete this.parent.binds[eventStamp] // removefrom bind function?
            }
          }
          conditionEvent.condition = this
          if (!this.inProgress) {
            this.inProgress = {} // deferEvent
          }
          this.inProgress[eventStamp] = conditionEvent
          this._input.call(bind, val, (cancel) => {
            if (cancel) {
              this.cancel(cancel, event)
            } else {
              conditionEvent.trigger()
            }
            this.inProgress = null
          }, conditionEvent)
        }
      }
    },
    remove: function () {
      this.cancel()
      return remove.apply(this, arguments)
    },
    cancel: function (data, event) {
      if (data instanceof Error) {
        // use bind!
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

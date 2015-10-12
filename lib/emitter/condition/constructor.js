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
      console.error('cancel (not implemented yet)')
    }
  },
  define: {
    bind: function () {
      return this.parent.parent.parent
    },
    trigger: function (event) {
      var stamp = event.stamp
      if ((!this.inProgress || !this.inProgress[stamp])) {
        let emitter = this._parent
        let bind = this.getBind()
        let val = this.parseValue(bind.parseValue(void 0, void 0, void 0, 0))
        let binds = emitter.binds
        let contextBinds = emitter.contextBinds

        if (val === false || !((binds && binds[stamp]) || contextBinds && contextBinds[stamp])) {
          console.warn('nothing valid for condition -- cancel', val)
        } else {
          let conditionEvent = new Event(this.parent)
          let conditionStamp = conditionEvent.stamp
          let data = emitter.data && emitter.data[stamp]

          conditionEvent.isTriggered = true
          conditionEvent.push(emitter)
          conditionEvent.condition = this

          if (binds && binds[stamp]) {
            binds[conditionStamp] = binds[stamp]
            delete binds[stamp] // removefrom bind function?
          }

          if (contextBinds && contextBinds[stamp]) {
            contextBinds[conditionStamp] = contextBinds[stamp]
            delete contextBinds[stamp] // removefrom bind function?
          }

          if (data) {
            emitter.storeData(conditionEvent, data)
            emitter.removeDataStorage(event)
          }

          if (!this.inProgress) {
            this.inProgress = {}
          }

          this.inProgress[stamp] = conditionEvent
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

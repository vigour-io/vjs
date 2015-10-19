'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove
var Event = require('../../event')

function Condition (val, event, parent, key, escape) {
  if (event) {
    this._ignoreStamp = event.stamp
  }
  Base.apply(this, arguments)
}

module.exports = new Base({
  constructor: Condition,
  key: 'condition',
  ignoreInput: true,
  properties: {
    inProgress: true,
    cancel () {
      console.warn('cancel, not implemented yet')
    }
  },
  define: {
    bind () {
      return this.parent.parent.parent
    },
    generateConstructor () {
      return function (val, event, parent, key) {
        Condition.apply(this, arguments)
      }
    },
    trigger (event) {
      var stamp = event.stamp
      if ((!this.inProgress || !this.inProgress[stamp])) {
        let emitter = this._parent
        let bind = this.getBind()
        let val = this.parseValue(bind.parseValue(void 0, void 0, void 0, 0))

        let binds = emitter.binds
        let contextBinds = emitter.contextBinds
        if (this._ignoreStamp === stamp) {
          delete this._ignoreStamp
        } else if (val === false || !((binds && binds[stamp]) || contextBinds && contextBinds[stamp])) {
          // console.warn('nothing valid for condition -- cancel', val)
        } else {
          let conditionEvent = new Event(emitter, emitter.key)
          let conditionStamp = conditionEvent.stamp
          let data = emitter.data && emitter.data[stamp]

          conditionEvent.isTriggered = true
          conditionEvent.push(emitter)
          conditionEvent.inherits = event
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
            emitter.data[conditionEvent.stamp] = data
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
    remove () {
      this.cancel()
      return remove.apply(this, arguments)
    },
    cancel (data, event) {
      if (data instanceof Error) {
        // use bind!
        this.getBind().emit('error', data)
      }
      // is this correct???
      // only null
      if (event) {

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

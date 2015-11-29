'use strict'
var Event = require('../../../event')

exports.inject = require('./internal')

exports.define = {
  trigger (event) {
    var stamp = event.stamp
    if ((!this.inProgress || !this.inProgress[stamp])) {
      let emitter = this.parent
      let bind = this.getBind()
      let val = this.parseValue(bind.parseValue(void 0, void 0, void 0, 0))
      let binds = emitter.binds
      let contextBinds = emitter.contextBinds

      if (this._ignoreStamp === stamp) {
        delete this._ignoreStamp
      } else if (val === false || !((binds && binds[stamp]) || contextBinds && contextBinds[stamp])) {
        console.warn('nothing valid for condition -- cancel', val, stamp, !((binds && binds[stamp])), emitter._path)
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
        this.triggerInternal(bind, val, conditionEvent, event)
      }
    }
  }
}

'use strict'
var Event = require('../../../event')
// var isEmpty = requi

exports.inject = require('./internal')

exports.define = {
  trigger (event) {
    var stamp = event.stamp
    if ((!this.inProgress || !this.inProgress[stamp])) {
      let emitter = this.parent
      let bind = this.getBind() // this is wrong!
      let val = this.parseValue(bind.parseValue(void 0, void 0, void 0, 0))
      let binds = emitter.binds

      if (event.type === this._parent.key && event.origin === this._parent._parent._parent) {
        console.log('   spawner remove it!')
        // event.remove() // call it clear (consistent!)
      }
      // let contextBinds = emitter.contextBinds
      if (this._ignoreStamp === stamp) {
        console.log('   condition: ignored: '.red.bold, '     ', stamp, event.type, this._parent.key)
        // if event.origin === this
        // double check for instances etc
        delete this._ignoreStamp
      } else if (val === false || !((binds && binds[stamp]))) {
        console.warn('nothing valid for condition -- cancel', val, stamp, !((binds && binds[stamp])), emitter._path)
      } else {
        for (var i in binds[stamp]) {
          doConditionEvent.call(this, binds[stamp][i], emitter, event, val)
        }
        delete binds[stamp]
        // clear event?
      }
    } else {
      console.log('allready in progress!'.red.bold, stamp)
    }
  }
}

function doConditionEvent (bound, emitter, event, val) {
  // how to check if there is not difference? (at least context can work like that)
  let conditionEvent = new Event(emitter, emitter.key)
  let conditionStamp = conditionEvent.stamp

  conditionEvent.isTriggered = true
  conditionEvent.push(emitter)
  conditionEvent.inherits = event
  conditionEvent.condition = this

  console.log('ok bitch!', conditionStamp)
  emitter.setBind(conditionEvent, bound.val, bound.data)
  console.log(emitter.binds)

  if (!this.inProgress || !this.hasOwnProperty('inProgress')) {
    this.inProgress = {}
  }

  this.inProgress[event.stamp] = conditionEvent

  if (!bound.val) {
    console.error('\n\n\n\n!!!!context no bound.val this later!!!')
  }

  this.triggerInternal(bound.val, val, conditionEvent, event)
}

/*
for (var i in binds[conditionStamp]) {
  if (binds[conditionStamp][i].val) {
    this.triggerInternal(binds[conditionStamp][i].val, val, conditionEvent, event)
    // each context is also different
  }
}
 */

// function clone() {
//
// }

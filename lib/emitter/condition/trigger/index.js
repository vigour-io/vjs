'use strict'
var Event = require('../../../event')
// var isEmpty = requi
var isNumberLike = require('../../../util/is/numberlike')

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
        for (var uid in binds[stamp]) {
          doConditionEvent.call(this, binds[stamp][uid], emitter, event, val, uid)
        }
        delete binds[stamp]
        // clear event?
      }
    } else {
      console.log('allready in progress!'.red.bold, stamp)
    }
  }
}

function doConditionEvent (bound, emitter, event, val, uid) {
  // how to check if there is not difference? (at least context can work like that)
  let conditionEvent = new Event(emitter, emitter.key)
  let conditionStamp = conditionEvent.stamp


  conditionEvent.isTriggered = true
  conditionEvent.push(emitter)
  conditionEvent.inherits = event
  conditionEvent.condition = this

  console.log('ok bitch!', conditionStamp)
  console.log(emitter.binds)
  // may not need to do bound.val
  var newbound = emitter.setBindInternal(conditionEvent, uid)

  copyDeep.call(this, bound, newbound, val, conditionEvent, event, bound.context)
  console.log(newbound)

  if (newbound.val) {
    // clearcontext
    newbound.val.clearContextUp()
    this.triggerInternal(newbound.val, val, conditionEvent, event)
  }

  if (!this.inProgress || !this.hasOwnProperty('inProgress')) {
    this.inProgress = {}
  }

  this.inProgress[event.stamp] = conditionEvent
  // this has to go for each...
}

function copyDeep (bound, obj, val, conditionEvent, event, context) {
  if (!obj) {
    obj = {}
  }
  for (var i in bound) {
    if (isNumberLike(i)) {
      console.log('CONTEXT'.red.bold)
      obj[i] = copyDeep.call(this, bound[i], false, val, conditionEvent, event, context)
    } else {
      obj[i] = bound[i]
      if (i === 'chain') {
        let bind = this.setContextChain(bound[i])
        this.triggerInternal(bind, val, conditionEvent, event)
        context[0].bind.setContextChain(context)
        // RESTORE!
      }
    }
  }
  return obj
}

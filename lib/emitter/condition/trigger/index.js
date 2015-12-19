'use strict'
var Event = require('../../../event')
var Base = require('../../../base')
// var isEmpty = requi
var isNumberLike = require('../../../util/is/numberlike')

exports.inject = require('./internal')

exports.define = {
  trigger (event) {
    var stamp = event.stamp
    let emitter = this.parent
    let bind = this.getBind() // this is wrong!
    bind._ignoreInput = true
    let val = this.parseValue(bind.parseValue(bind._input instanceof Base ? bind._input.val : bind._input , void 0, void 0, 0))
    bind._ignoreInput = null

    let binds = emitter.binds

    if (event.type === this._parent.key && event.origin === this._parent._parent._parent) {
      // console.log('   spawner remove it!')
      // event.remove() // call it clear (consistent!)
    }
    if (this._ignoreStamp === stamp) {
      delete this._ignoreStamp
    } else if (val === false || !((binds && binds[stamp]))) {
      // console.warn('nothing valid for condition -- cancel', val, stamp, !((binds && binds[stamp])), emitter._path)
    } else {
      for (let uid in binds[stamp]) {
        // normal
        let bound = binds[stamp][uid]
        if (bound.val) {
          doConditionEvent.call(this, bound, emitter, event, val, uid)
        }

        if (bound.context) {
          walkContexts.call(this, bound, emitter, event, val, uid)
        }
        // also walk it
      }
      delete binds[stamp]
    }
  }
}

function walkContexts (bound, emitter, event, val, uid, path, level) {
  if (!path) {
    path = []
    // path.context = bound.context
  }
  if (!level) {
    level = bound
  }
  for (var i in level) {
    if (isNumberLike(i)) {
      walkContexts.call(this, bound, emitter, event, val, uid, path.concat([i]), level[i])
    } else if (i === 'chain') {
      let obj = { context: bound.context }
      let objorig = obj
      for (let j in path) {
        obj = obj[path[j]] = {}
      }
      obj.chain = level[i]
      doConditionEvent.call(this, bound, emitter, event, val, uid, objorig, level[i])
    }
  }
}

function doConditionEvent (bound, emitter, event, val, uid, context, chain) {
  let conditionEvent = new Event(emitter, emitter.key)
  conditionEvent.isTriggered = true
  conditionEvent.push(emitter)
  conditionEvent.inherits = event
  conditionEvent.condition = this
  var newbound = emitter.setBindInternal(conditionEvent, uid)
  if (context) {
    for (let i in context) {
      newbound[i] = context[i]
    }
    newbound.data = bound.data
    let bind = this.setContextChain(chain)
    this.triggerInternal(bind, val, conditionEvent, event, newbound.data)
    newbound.context[0].bind.setContextChain(newbound.context)
    // reset?
  } else {
    newbound.val = bound.val
    newbound.data = bound.data
    newbound.val.clearContextUp()
    this.triggerInternal(newbound.val, val, conditionEvent, event, newbound.data)
  }
}

// function copyDeep (bound, obj, val, conditionEvent, event, context) {
//   for (var i in bound) {
//     if (isNumberLike(i)) {
//       obj[i] = copyDeep.call(this, bound[i], {}, val, conditionEvent, event, context)
//     } else {
//       obj[i] = bound[i]
//     }
//   }
//   return obj
// }

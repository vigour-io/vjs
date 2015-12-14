'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./constructor')
var incrementLevel = require('./current/inc/level')
// this is the starting info value when subscribing on own ref
var refInfo = incrementLevel(0)

exports.define = {
  subscribe (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var self = this
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified) //hash(val.toString())//
    var emitter = self._on && self._on[hashed]

    // console.log('????', self.path.join('.'))
    // var refAttach = self.ChildConstructor.prototype._on && self.ChildConstructor.prototype._on.reference && self.ChildConstructor.prototype._on.reference.attach
    // console.log('----ref?--->', refAttach)
    // if (refAttach) {
    //   var childPattern = refAttach.each(function (property, key) {
    //     console.log('pattern:', JSON.stringify(pattern))
    //     console.log('xxxxxxx', property[2][3])
    //     return property[2][3]
    //   })
    //   console.error('childPattern', childPattern)
    //   if (childPattern) {
    //     pattern.$childPattern = childPattern
    //     console.log('after', JSON.stringify(pattern))
    //   }
    // }

    if (!emitter) {


      self = self.set({
        on: {
          [hashed]: new SubsEmitter({
            pattern: pattern
          })
        }
      }, event) || this
      emitter = self._on[hashed]
    } else {
      // emitter.pattern.set(pattern)
    }

    self.on(hashed, val, key, unique, event)
    
    // if (pattern === true) {
    //   emitter.subFieldRef(false, event, this._input, emitter.pattern, refInfo, { val: true }, {}, this)
    // } else {
      emitter.subField(false, event, this, emitter.pattern, 0, { val: true }, {})
    // }

    return emitter
  },
  unsubscribe (hashed) {
    var on = this._on
    if (!on) {
      console.warn('trying to unsubscribe on observable without listeners')
    }
    if (!hashed) {
      on.each(removeEmitter)
    } else {
      // if (typeof hashed === 'object') {
      //   hashed = hash(JSON.stringify(hashed))
      // }
      let emitter = on[hashed]
      if (emitter) {
        emitter.remove()
        // TODO: update the pattern!
      }
    }
  }
}

function removeEmitter (property) {
  if (property instanceof SubsEmitter) {
    property.remove()
  }
}


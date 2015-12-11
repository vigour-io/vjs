'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./constructor')

exports.define = {
  subscribe (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var self = this
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified) //hash(val.toString())//
    var emitter = self._on && self._on[hashed]

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
    
    emitter.subField(false, event, this, emitter.pattern, 0, { val: true }, {})

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


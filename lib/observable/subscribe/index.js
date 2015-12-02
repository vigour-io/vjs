'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./constructor')

exports.define = {
  subscribe (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified)

    if (!this._on || !this._on[hashed]) {
      this.set({
        on: {
          [hashed]: new SubsEmitter({
            pattern: pattern
          })
        }
      }, event)
      let emitter = this._on[hashed]
      // emitter.pattern.set(pattern)
      emitter.subField(false, event, this, emitter.pattern, 0, true, {})
    }
    this.on(hashed, val, key, unique, event)
    return this._on[hashed]
  },
  unsubscribe (hashed) {
    var on = this._on
    if (!on) {
      console.warn('trying to unsubscribe on observable without listeners')
    }
    if (!hashed) {
      on.each(function (property, key) {
        if (property instanceof SubsEmitter) {
          property.remove()
        }
      })
    } else {
      if (typeof hashed === 'object') {
        hashed = hash(JSON.stringify(hashed))
      }
      let emitter = on[hashed]
      if (emitter) {
        emitter.remove()
        // TODO: update the pattern!
      }
    }
  }
}

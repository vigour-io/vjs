'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./constructor')

exports.inject = require('./pattern')

exports.define = {
  subscribe (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified)
    var setObj

    if (!this._on || !this._on[hash]) {
      setObj = {
        on: {}
      }
      setObj.on[hashed] = new SubsEmitter()
        // FIXME: this is a dirty fix so we can do stuff quick and dirty
      setObj.on[hashed]._pattern = pattern
      this.set(setObj, event)
      this._on[hashed].set({
        pattern: pattern
      }, event)
    }
    this.on(hashed, val, key, unique, event)
    return this._on[hashed]
  },
  unsubscribe (hash) {
    var on = this._on
    if (!on) {
      console.warn('trying to unsubscribe on observable without listeners')
    }
    if (!hash) {
      on.each(function (property, key) {
        if (property instanceof SubsEmitter) {
          property.remove()
        }
      })
      this.pattern.remove()
    } else {
      let emitter = on[hash]
      if (emitter) {
        emitter.remove()
        // TODO: update the pattern!
      }
    }
  }
}

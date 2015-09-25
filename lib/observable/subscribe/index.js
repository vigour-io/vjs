'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./constructor')

// add on addition get by pattern (auto hash) x

exports.define = {
  subscribe: function (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified)
    var setObj
    if (!this._on || !this._on[hash]) {
      setObj = {
        on: {}
      }
      setObj.on[hashed] = new SubsEmitter()
      this.set(setObj)
      this._on[hashed].set({
        pattern: pattern
      })
    }
    this.on(hashed, val, key, unique, event)
    return this._on[hashed]
  }
}

// $on.weak(obj) //hash 'n get

'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./emitter')
var Base = require('../../base')

exports.properties = {
  pattern: new Base({
    define: {
      each(fn) {
        var ret
        for (var i in this) {
          if (i[0] !== '_' && i !== 'key') {
            ret = fn.call(this, this[i], i)
            if (ret) {
              return ret
            }
          }
        }
      }
    },
    ChildConstructor: 'Constructor'
  }).Constructor
}

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
        // FIXME: this is a dirty fix so we can do stuff quick and dirty
      setObj.on[hashed]._pattern = pattern
      this.set(setObj, event)
      this._on[hashed].set({
        pattern: pattern
      }, event)
    }
    this.on(hashed, val, key, unique, event)
    return this._on[hashed]
  }
}

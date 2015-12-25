'use strict'
var resolve = require('./resolve')

exports.properties = {
  on: { val: require('./constructor'), override: '_on' },
  listensOnBase: true,
  listensOnAttach: true,
  overrides: true
}

exports.overrides = require('./constructor').prototype._properties._overrides

// more stuff can be reused here -- cleanup later
exports.define = {
  on (type, val, key, unique, event) {
    if (this._input === null) {
      return this
    } else if (typeof type !== 'string') {
      return this.on('data', type, val, key, unique)
    }
    let override = this.overrides[type]
    if (override) {
      type = override
    }
    let observable = resolve.call(this, type, val, key, event)
    observable._on[type].on(val, key, unique, event)
    return observable
  },
  once (type, val, key, unique, event) {
    if (this._input === null) {
      return this
    } else if (typeof type !== 'string') {
      return this.once('data', type, val, key, unique)
    }
    let override = this.overrides[type]
    if (override) {
      type = override
    }
    let observable = resolve.call(this, type, val, key, event)
    observable._on[type].once(val, key, unique, event)
    return observable
  }
}

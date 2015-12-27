'use strict'
var resolve = require('./resolve')
var On = require('./constructor')

exports.properties = {
  on: { val: On, override: '_on' },
  listensOnBase: true,
  listensOnAttach: true,
  overrides: true
}

exports.overrides = On.prototype._properties._overrides

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

// split the args parser and the internal saves a lot of speed

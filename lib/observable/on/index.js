'use strict'

exports.properties = {
  on: { val: require('./constructor'), override: '_on' }
}

function onCreation (type, val, key, unique, event) {
  var context
  var observable = this
  var on = this.hasOwnProperty('_on') && this._on
  if (!on || !on[type] || on._context) {
    var set = { on: {} }
    set.on[type] = {}
    context = this._context
    if (context) {
      observable = this.resolveContext(set, false, context, true)
    } else {
      this.set(set, false)
    }
  }
  return observable
}

// more stuff can be reused here -- cleanup later
exports.define = {
  on (type, val, key, unique, event) {
    if (typeof type !== 'string') {
      return this.on('data', type, val, key, unique)
    }
    let override = this.getProperty('on', type, 'override')
    if (override) {
      type = override
    }
    var observable = onCreation.call(this, type, val, key, unique, event)
    observable._on[type].on(val, key, unique, event)
    return observable
  },
  once (type, val, key, unique, event) {
    if (typeof type !== 'string') {
      return this.once('data', type, val, key, unique)
    }
    let override = this.getProperty('on', type, 'override')
    if (override) {
      type = override
    }
    var observable = onCreation.call(this, type, val, key, unique, event)
    observable._on[type].once(val, key, unique, event)
    return observable
  }
}

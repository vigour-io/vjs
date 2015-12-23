'use strict'

exports.properties = {
  on: { val: require('./constructor'), override: '_on' },
  listensOnBase: true,
  listensOnAttach: true
}

function onCreation (type, val, key, unique, event) {
  var observable = this
  var on = this.hasOwnProperty('_on') && this._on
  if (!on) {
    this.setKey('on', {})
    this._on.setKey(type, void 0, event)
  } else if (on._context) {
    observable = resolveContext(observable, type, on)
  } else if (!on[type]) {
    on.setKey(type, void 0, event) // passon events!
  }
  return observable
}

function resolveContext (observable, type, on) {
  // maybe need {} here
  return observable.resolveContext({on: {[type]: void 0}}, false, on._context)
}

// more stuff can be reused here -- cleanup later
exports.define = {
  on (type, val, key, unique, event) {
    if (this._input === null) {
      return this
    } else if (typeof type !== 'string') {
      return this.on('data', type, val, key, unique)
    }
    let override = this.getProperty('on', type, 'override')
    if (override) {
      type = override
    }
    let observable = onCreation.call(this, type, val, key, unique, event)
    observable._on[type].on(val, key, unique, event)
    return observable
  },
  once (type, val, key, unique, event) {
    if (this._input === null) {
      return this
    } else if (typeof type !== 'string') {
      return this.once('data', type, val, key, unique)
    }
    let override = this.getProperty('on', type, 'override')
    if (override) {
      type = override
    }
    let observable = onCreation.call(this, type, val, key, unique, event)
    observable._on[type].once(val, key, unique, event)
    return observable
  }
}

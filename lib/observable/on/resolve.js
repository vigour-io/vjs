'use strict'
module.exports = function onCreation (type, val, key, event, payload) {
  var observable = this
  var on = this.hasOwnProperty('_on') && this._on
  if (!on) {
    this.setKey('on', {})
    this._on.setKey(type, payload, event)
  } else if (on._context) {
    observable = resolveContext(observable, type, on)
  } else if (!on[type]) {
    on.setKey(type, payload, false) // passon events!
  }
  return observable
}

function resolveContext (observable, type, on, payload) {
  return observable.resolveContext({on: {[type]: payload}}, false, on._context)
}

'use strict'
var Event = require('../event')

function Observable (val, event, parent, key, escape) {
  var trigger
  if (event === void 0) {
    event = new Event(this, 'new')
    trigger = true
  }
  if (this.trackInstances) {
    this.addToInstances(event)
  }
  this.setParent(val, event, parent, key)
  if (this._on) {
    this._on.newParent(this, event)
  }
  if (val !== void 0) {
    this.set(val, event, true, escape)
  }
  this.emit('new', void 0, event || void 0)
  // sort of turn on event thign
  if (trigger) { // if !xxxx
    event.trigger() // dont do this when its not nessecary
  }
}

exports.constructor = Observable

exports.define = {
  generateConstructor () {
    return function derivedObservable (val, event, parent, key) {
      this.clearContext()
      Observable.apply(this, arguments)
    }
  }
}

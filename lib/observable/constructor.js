'use strict'
var Event = require('../event')

function Observable (val, event, parent, key, escape) {
  if (event === void 0) {
    event = new Event(this, 'new')
  }
  if (this.trackInstances) {
    this.addToInstances(event)
  }
  // console.error('whats happenin here??????')
  this.setParent(val, event, parent, key)
  // TODO: this is a very specific fix for on, do this smarter!
  if (this._on) {
    this._on.newParent(this, event)
  }
  // ----------------
  if (val !== void 0) {
    this.set(val, event, true, escape)
  }

  // // This fixes the order in listeners
  // if (this._on) {
  //   this.uid
  // }

  // do this better when resolve context is done, check is overhead
  this.emit('new', void 0, event || void 0)
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

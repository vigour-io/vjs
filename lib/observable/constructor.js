'use strict'
var Event = require('./events').New

function Observable (val, event, parent, key, escape) {
  var trigger
  if (event === void 0) {
    console.warn('NEW lets make event', this.key, event, this._path)
    event = new Event()
    trigger = true
  }
  if (this.trackInstances) {
    this.addToInstances(event)
  }
  this.setParent(val, event, parent, key)
  if (val !== void 0) {
    this.set(val, event, true, escape)
  }
  if (event !== false) {
    global.uids[this.uid] = this
    console.log('NEW EMIT')
    this.emit('new', void 0, event)
    if (trigger) {
      event.trigger()
    }
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

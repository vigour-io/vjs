'use strict'
var hash = require('../../util/hash')
var SubsEmitter = require('./constructor')
// var incrementLevel = require('./current/inc/level')
// this is the starting info value when subscribing on own ref
// var refInfo = incrementLevel(0)
var resolve = require('../on/resolve')
//type, val, key, event, payload

exports.properties = {
  _childSub: true
}

exports.define = {
  subscribe (pattern, val, key, unique, event) {
    // TODO cache the stringified
    var self = this
    var stringified = JSON.stringify(pattern)
    var hashed = hash(stringified) //hash(val.toString())//
    var emitter
    self = resolve.call(this, hashed, val, hashed, event, !(self._on && self._on[hashed]) && new SubsEmitter({
      pattern: pattern
    }))
    // resolve emitter
    emitter = self._on[hashed]

    // if (!emitter || !(self._on.hasOwnProperty(hashed))) {
    //   console.log('xxxxxx')
    //
    //   self = self.set({
    //     on: {
    //       [hashed]: new SubsEmitter({
    //         pattern: pattern
    //       })
    //     }
    //   }, event) || this
    //   emitter = self._on[hashed]
    // } else {
    //   // emitter.pattern.set(pattern)
    // }

    // this has to block the same listener
    self.on(hashed, val, key, unique, event)

    self.on('remove', [ function (data, event, emitter) {
      var onRemove = emitter.onRemove
      if (onRemove) {
        for (let i = onRemove.length - 1; i >= 0; i--) {
          onRemove[i].onSubRemove(emitter, event)
        }
      }
    }, emitter])

    // if (pattern === true) {
    //   emitter.subFieldRef(false, event, this._input, emitter.pattern, refInfo, { val: true }, {}, this)
    // } else {
      emitter.subField(false, event, this, emitter.pattern, 1, { val: true }, {})
    // }

    return emitter
  },
  unsubscribe (hashed) {
    var on = this._on
    if (!on) {
      console.warn('trying to unsubscribe on observable without listeners')
    }
    if (!hashed) {
      on.each(removeEmitter)
    } else {
      if (typeof hashed === 'object') {
        hashed = hash(JSON.stringify(hashed))
      }
      let emitter = on[hashed]
      if (emitter) {
        emitter.remove()
        // TODO: update the pattern!
      }
    }
  }
}

function removeEmitter (property) {
  if (property instanceof SubsEmitter) {
    property.remove()
  }
}

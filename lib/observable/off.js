'use strict'
var Emitter = require('../emitter')

exports.define = {
  off: function (type, val, event) {
    if (typeof type === 'string') {
      if (!val) {
        val = 'val'
      }
      var emitter = this.on && this.on[type]
      if (emitter) {
        emitter.off(val)
      }
    } else {
      findAndRemove(this, type, void 0, val)
    }
  }
}

function findAndRemove (base, val, emitter, key) {
  var key$
  if (!emitter) {
    // TODO clean this up
    if (key) {
      for (key$ in base._on) {
        if (base._on[key$] instanceof Emitter) {
          base._on[key$].off(key)
        }
      }
    } else {
      for (key$ in base._on) {
        if (base._on[key$] instanceof Emitter) {
          findAndRemove(base, val, base._on[key$], key)
        }
      }
    }
  } else {
    emitter.off(val, key)
  }
}

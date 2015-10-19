'use strict'
var getLateral = require('../info').getLateral
var getReferenced = require('../shared').getReferenced

module.exports = function reference (data, event, emitter, pattern, info, mapvalue, map) {
  var lateral = getLateral(info)

  // TODO remove this, we need a proper fix
  var on = this._on
  if (on._context) {
    on.resolveContext({})
  }

  emitter.listensOnAttach.each(function (property) {
    var attach = property.attach
    attach.each(function (prop, key) {
      if (getLateral(prop[3]) >= lateral) {
        // TODO remove listener reliably!
        // console.info('* removing', getLateral(prop[3]), lateral, prop)
        // attach.removeProperty(prop, key)
      }
    })
  })

  unfindReferenced(pattern, lateral)

  var referenced = getReferenced(this)
  if (referenced) {
    emitter.subscribe({
      reference: this._input
    }, event, referenced, pattern, info, mapvalue, map)
  }
}

function unfindReferenced (pattern, lateral) {
  for (var i in pattern) {
    var value = pattern[i]
    if (typeof value === 'number') {
      if (getLateral(value) >= lateral) {
        pattern[i] = true
      }
    } else if (value !== true) {
      unfindReferenced(value, lateral)
    }
  }
}

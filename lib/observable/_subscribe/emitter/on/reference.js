'use strict'
var info = require('../info')
var getLateral = info.getLateral
var incrementLateral = info.incrementLateral
var getReferenced = require('../shared').getReferenced

module.exports = function reference (data, event, emitter, pattern, info, mapvalue, map) {
  info = incrementLateral(info)
  var lateral = getLateral(info)

  emitter.listensOnAttach.each(function (property) {
    var attach = property.attach
    attach.each(function (prop, key) {
      if (getLateral(prop[3]) >= lateral) {
        // TODO remove listener reliably!
        // console.log('* removing', getLateral(prop[3]), lateral, prop)
        // console.log('?',prop[1].uid)
        // attach.removeProperty(prop, key)
      }
    })
  })

  unfindReferenced(pattern, lateral)

  var referenced = getReferenced(this)
  if (referenced) {
    emitter.subscribe({
      context: this,
      map: mapvalue
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

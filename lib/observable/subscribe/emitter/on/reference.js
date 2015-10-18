'use strict'
var getLateral = require('../info').getLateral
var getReferenced = require('../shared').getReferenced

module.exports = function reference (data, event, emitter, pattern, info, mapvalue, map) {
  var lateral = getLateral(info)

  emitter.listensOnAttach.each(function (property) {
    var attach = property.attach
    attach.each(function (prop, key) {
      if (prop[3] >= lateral) {
        attach.removeProperty(prop, key)
      }
    })
  })

  unfindReferenced(pattern, lateral)

  var referenced = getReferenced(this)
  if (referenced) {
    emitter.subscribe({fromRefChange: true}, event, referenced, pattern, info, mapvalue, map)
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

'use strict'
var info = require('../info')
var getLateral = info.getLateral
var incLateral = info.incLateral
var getReferenced = require('../util/reference')

module.exports = function onReference (data, event, emitter, pattern, info, mapValue, map) {
  info = incLateral(info)
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

    console.error('-----from ref', this.path, referenced.path)

    emitter.subscribeObject({
      context: this,
      map: mapValue
    }, event, referenced, pattern, info, mapValue, map)
  }
}

function unfindReferenced (pattern, lateral) {
  pattern.each((property) => {
    var value = property.val
    if (typeof value === 'number') {
      if (getLateral(value) >= lateral) {
        property.val = true
      }
    } else if (value !== true) {
      unfindReferenced(value, lateral)
    }
  })
}

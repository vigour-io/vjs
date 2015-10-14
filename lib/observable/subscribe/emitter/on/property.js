'use strict'
var subscribe = require('../shared').subscribe
var getDepth = require('../info').getDepth
var getLateral = require('../info').getLateral

module.exports = function property (data, event, emitter, pattern, info, mapvalue, map) {
  var added = data && data.added
  var found
  var i

  if (added) {
    for (i = added.length - 1; i >= 0; i--) {
      let key = added[i]
      if (pattern[key]) {
        map.parent = mapvalue
        subscribe(emitter, data, event, this[key], pattern, key, info, map)
        found = true
      }
    }

    if (found) {
      for (i in pattern) {
        var value = pattern[i]
        if (i === 'parent' || i === 'upward') {
          continue
        }
        if (!isFulfilled(value, info)) {
          return
        }
      }
      var attach = this._on.property.attach
      attach.each(function (prop, key) {
        if (prop[1] === emitter) {
          attach.removeProperty(prop, key)
        }
      })
    }
  }
}

function isFulfilled (value, info) {
  var depth = getDepth(info) + 1
  var lateral = getLateral(info)
  if (typeof value === 'number') {
    var founddepth = getDepth(value)
    if (founddepth < depth) {
      return true
    }
    if (founddepth === depth) {
      if (getLateral(value) <= lateral) {
        return true
      }
    }
  }
}

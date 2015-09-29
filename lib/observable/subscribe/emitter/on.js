'use strict'
var info = require('./info')
var util = require('./util')

var getLateral = info.getLateral
var getDepth = info.getDepth

var subscribe = util.subscribe
var getReferenced = util.getReferenced

exports.upward = function (data, event, emitter, pattern, info, mapvalue, map) {
  map[this.key] = mapvalue
  emitter.upward({}, event, this.parent, pattern, info, map)
// should I remove the parent listener now? Perhaps keep it for the instances
}

exports.parent = function (data, event, emitter, pattern, info, mapvalue, map) {
  map[this.key] = mapvalue
  subscribe(emitter, {}, event, this.parent, pattern, 'parent', info, map)
// should I remove the parent listener now? Perhaps keep it for the instances
}

exports.property = function (data, event, emitter, pattern, info, mapvalue, map) {
  var added = data && data.added
  var found
  var i

  if (added) {
    for (i = added.length - 1; i >= 0; i--) {
      var key = added[i]
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
    }

    var attach = this._on.property.attach
    attach.each(function (prop, key) {
      if (prop[0] === exports.property) {
        attach.removeProperty(prop, key)
      }
    })
  }
}

exports.reference = function (data, event, emitter, pattern, info, mapvalue, map) {
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
    emitter.subscribe(data, event, referenced, pattern, info, mapvalue, map)
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

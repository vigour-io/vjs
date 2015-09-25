'use strict'
var on = require('./on')
var info = require('./info')

var onAny = on.any
var onProperty = on.property
var onParent = on.parent
var onReference = on.reference

var util = require('./util')

var subscribe = util.subscribe
var getReferenced = util.getReferenced

var incrementLateral = info.incrementLateral

module.exports = function (event, meta, obj, pattern, info, mapvalue, map) {
  var addedPropertyListener
  var addedParentListener
  var any = pattern['*']
  var emitter = this

  if (!map) {
    map = {}
  }

  if (!mapvalue) {
    mapvalue = true
  }

  if (any) {
    map.parent = mapvalue
    obj.each(function (property, key) {
      subscribe(emitter, event, meta, property, any, key, info, map)
    })
    obj.on('property', [onAny, emitter, pattern, info, mapvalue, map])
    addedPropertyListener = true
  }

  for (var key in pattern) {
    if (key === 'upward') {
      emitter.upward(event, meta, obj, pattern.upward, info, mapvalue, map)
      continue
    }
    if (key === '&') {
      continue
    }
    if (key === '*') {
      continue
    }

    var property = obj[key]

    if (property && property._input !== null) {
      if (key === 'parent') {
        map[obj.key] = mapvalue
      } else if (!map.parent) {
        map.parent = mapvalue
      }
      console.log('!!!!', key, mapvalue, map)
      subscribe(emitter, event, meta, property, pattern, key, info, map)
    } else if (key === 'parent') {
      obj.on('addToParent', [onParent, emitter, pattern, info, mapvalue, map])
      addedParentListener = true
    } else if (!addedPropertyListener) {
      obj.on('property', [onProperty, emitter, pattern, info, mapvalue, map])
      addedPropertyListener = true
    }
  }

  if (!addedPropertyListener && !addedParentListener) {
    return pattern
  }

  var referenced = getReferenced(obj)
  if (referenced) {
    info = incrementLateral(info)
    obj.on('reference', [onReference, emitter, pattern, info, mapvalue, map])
    return emitter.subscribe(event, meta, referenced, pattern, info, mapvalue, map)
  }
}

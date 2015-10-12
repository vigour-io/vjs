'use strict'
var info = require('./info')
var emit = require('./emit')
var onAny = require('./on/any')
var onProperty = require('./on/property')
var onParent = require('./on/parent')
var onReference = require('./on/reference')
var shared = require('./shared')

var subscribe = shared.subscribe
var getReferenced = shared.getReferenced

var incrementLateral = info.incrementLateral

module.exports = function (data, event, obj, pattern, info, mapvalue, map) {
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
      subscribe(emitter, data, event, property, any, key, info, map)
    })
    obj.on('property', [onAny, emitter, pattern, info, mapvalue, map])
    addedPropertyListener = true
  }

  for (var key in pattern) {
    if (key === 'upward') {
      emitter.upward(data, event, obj, pattern.upward, info, mapvalue, map)
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

      // TODO change to instanceof Observable
      if (property.on) {
        subscribe(emitter, data, event, property, pattern, key, info, map)
      } else {
        emit(data, event, obj, mapvalue, emitter.key, event && event.type === 'parent')
      }

    } else if (key === 'parent') {
      obj.on('parent', [onParent, emitter, pattern, info, mapvalue, map])
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
    return emitter.subscribe(data, event, referenced, pattern, info, mapvalue, map)
  }
}

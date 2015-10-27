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
  var didNotFindEverything
  var addedPropertyListener
  var any = pattern['*']

  console.warn(pattern)

  if (!mapvalue) {
    mapvalue = true
  }

  if (!map) {
    map = {}
  }

  if (any) {
    map.parent = mapvalue
    obj.each((property, key) => {
      subscribe(this, data, event, property, any, key, info, map)
    })
    obj.on('property', [onAny, this, pattern, info, mapvalue, map])
    didNotFindEverything = addedPropertyListener = true
  }

  pattern.each((prop, key) => {
    console.warn(key)
    if (key === 'upward') {
      this.upward(data, event, obj, pattern.upward, info, mapvalue, map)
      return
    }
    if (key === '&') {
      return
    }
    if (key === '*') {
      return
    }

    if (key === 'sub_parent') {
      key = 'parent'
    }

    let property = obj[key]
    if (property && property._input !== null) {
      if (key === 'parent') {
        map[obj.key] = mapvalue
      } else if (!map.parent) {
        map.parent = mapvalue
      }
      if (property.on) {
        console.log('????',pattern)
        let found = subscribe(this, data, event, property, pattern, key, info, map)
        if (!found) {
          didNotFindEverything = true
        }
      } else {
        emit(data, event, obj, mapvalue, this.key, event && event.type === 'parent')
      }
    } else if (key === 'parent') {
      obj.on('parent', [onParent, this, pattern, info, mapvalue, map])
      didNotFindEverything = true
    } else if (!addedPropertyListener) {
      this.addListener(obj, 'property', [onProperty, this, pattern, info, mapvalue, map])
      didNotFindEverything = addedPropertyListener = true
    }
  })

  if (didNotFindEverything) {
    this.addListener(obj, 'reference', [onReference, this, pattern, info, mapvalue, map])
    let referenced = getReferenced(obj)
    if (referenced) {
      // NOTE decided to always add reference listener, for when ref is added after the subscribtion
      return this.subscribe(data, event, referenced, pattern, incrementLateral(info), mapvalue, map)
    }
  } else {
    return pattern
  }
}

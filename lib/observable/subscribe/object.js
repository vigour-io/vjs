'use strict'
var parentListeners = require('./listeners/parent')
var incrementLevel = require('./current/inc/level')
var propListeners = require('./listeners/property')
var refListeners = require('./listeners/reference')
var reference = require('../../util/get/reference')
// var isRemoved = require('../../util/is/removed')
var isRemoved = function (obs) {
  return obs._input === null
}

var onReferenceRef = refListeners.reference
var onPropertyRef = propListeners.reference
var onParentRef = parentListeners.reference

var onReference = refListeners.direct
var onProperty = propListeners.direct
var onParent = parentListeners.direct

exports.define = {
  subObj (data, event, obs, pattern, current, mapvalue, map) {
    var addedListener, incomplete
    pattern.each((field, key) => {
      var found
      if (key === 'upward') {
        found = this.subUp(data, event, obs, field, current, mapvalue, map)
      } else if (key === 'sub_parent') {
        let property = obs.parent
        if (property && !isRemoved(property)) {
          map[obs.key] = mapvalue
          found = this.subField(data, event, property, field, current, mapvalue, map)
        } else {
          obs.on('parent', [onParent, this, pattern, current, mapvalue, map], this.key)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          map.parent = mapvalue
          found = this.subField(data, event, property, field, current, mapvalue, map)
        } else if (!addedListener) {
          obs.on('property', [onProperty, this, pattern, current, mapvalue, map], this.key)
          addedListener = true
        }
      }

      if (!found) {
        incomplete = true
      }
    })

    if (!incomplete) {
      return true
    }

    obs.on('reference', [onReference, this, pattern, current, mapvalue, map], this.key)
    let ref = reference(obs)
    if (ref) {
      return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map)
    }
  },

  subObjRef (data, event, obs, pattern, current, mapvalue, map, context, contextmapvalue) {
    var addedListener, incomplete
    pattern.each((field, key) => {
      var found
      if (key === 'upward') {
        found = this.subUpRef(data, event, obs, field, current, mapvalue, map, context, contextmapvalue)
      } else if (key === 'sub_parent') {
        let property = obs.parent
        if (!isRemoved(property)) {
          map[obs.key] = mapvalue
          found = this.subFieldRef(data, event, property, field, current, mapvalue, map, context, contextmapvalue)
        } else {
          obs.on('parent', [onParentRef, this, pattern, current, mapvalue, map, context, contextmapvalue], this.key)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          map.parent = mapvalue
          found = this.subFieldRef(data, event, property, field, current, mapvalue, map, context, contextmapvalue)
        } else if (!addedListener) {
          obs.on('property', [onPropertyRef, this, pattern, current, mapvalue, map, context, contextmapvalue], this.key)
          addedListener = true
        }
      }

      if (!found) {
        incomplete = true
      }
    })

    if (!incomplete) {
      return true
    }

    obs.on('reference', [onReferenceRef, this, pattern, current, mapvalue, map, context, contextmapvalue], this.key)
    let ref = reference(obs)
    if (ref) {
      return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, obs, mapvalue)
    }
  }
}
'use strict'
var parentListeners = require('./listeners/parent')
var removeListeners = require('./listeners/remove')
var incrementLevel = require('./current/inc/level')
var propListeners = require('./listeners/property')
var refListeners = require('./listeners/reference')

var reference = require('../../util/get/reference')
var mergeListener = require('./merge')

var onReferenceRef = refListeners.reference
var onPropertyRef = propListeners.reference
var onParentRef = parentListeners.reference
var onRemoveRef = removeListeners.reference

var onReference = refListeners.direct
var onProperty = propListeners.direct
var onParent = parentListeners.direct
var onRemove = removeListeners.direct

var isRemoved = function (obs) {
  return obs._input === null
}

exports.define = {
  subObj (data, event, obs, pattern, current, mapvalue, map) {
    var id = this.uid
    var addedListener, incomplete
    pattern.each((field, key) => {
      let found
      if (key === '$condition') {
        this.subCondition(data, event, obs, pattern, current, mapvalue, map)
      } else if (key === 'upward') {
        found = this.subUp(data, event, obs, field, current, mapvalue, map)
      } else if (key === 'sub_parent') {
        let property = obs.parent
        if (property && !isRemoved(property)) {
          map[obs.key] = mapvalue
          found = this.subField(data, event, property, field, current, map)
        } else {
          obs.on('parent', [onParent, this, pattern, current, mapvalue, map], id)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          map.parent = mapvalue
          found = this.subField(data, event, property, field, current, map)
        } else if (!addedListener) {
          if (!mergeListener(obs, 'property', id, mapvalue)) {
            obs.on('property', [onProperty, this, pattern, current, mapvalue, map], id)
            obs.on('remove', [onRemove, this, current, mapvalue], id)
          }
          addedListener = true
        }
      }

      if (!found) {
        incomplete = true
      }
    }, function (thisKey, key) {
      return key !== 'key'
    })

    if (incomplete) {
      obs.on('reference', [onReference, this, pattern, current, mapvalue, map], id)
      let ref = reference(obs)
      if (ref) {
        return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, obs)
      }
    } else {
      return true
    }
  },

  subObjRef (data, event, obs, pattern, current, mapvalue, map, context) {
    var id = this.uid
    var addedListener, incomplete
    pattern.each((field, key) => {
      let found
      if (key === 'upward') {
        found = this.subUpRef(data, event, obs, field, current, mapvalue, map, context)
      } else if (key === 'sub_parent') {
        let property = obs.parent
        if (!isRemoved(property)) {
          found = this.subFieldRef(data, event, property, field, current, mapvalue, map, context)
        } else {
          obs.on('parent', [onParentRef, this, pattern, current, mapvalue, map, context], id)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          found = this.subFieldRef(data, event, property, field, current, mapvalue, map, context)
        } else if (!addedListener) {
          if (!mergeListener(obs, 'property', id, mapvalue)) {
            obs.on('property', [onPropertyRef, this, pattern, current, mapvalue, map, context], id)
            obs.on('remove', [onRemoveRef, this, current, mapvalue, context], id)
          }
          addedListener = true
        }
      }

      if (!found) {
        incomplete = true
      }
    })

    if (incomplete) {
      obs.on('reference', [onReferenceRef, this, pattern, current, mapvalue, map, context], id)
      let ref = reference(obs)
      if (ref) {
        return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, obs)
      }
    } else {
      return true
    }
  }
}

'use strict'
var parentListeners = require('./listeners/parent')
var incrementLevel = require('./current/inc/level')
var propListeners = require('./listeners/property')
var refListeners = require('./listeners/reference')
var reference = require('../../util/get/reference')
var merge = require('../../util/merge')

var resolvePattern = require('./resolve')
var isRemoved = function (obs) {
  return obs._input === null
}

var onReferenceRef = refListeners.reference
var onPropertyRef = propListeners.reference
var onParentRef = parentListeners.reference

var onReference = refListeners.direct
var onProperty = propListeners.direct
var onParent = parentListeners.direct

var onRemove = function (data, event, emitter, pattern, current, mapvalue) {
  emitter.findResubscribeProp(data, event, this, pattern, current, mapvalue)
}

var onRemoveRef = function (data, event, emitter, current, mapvalue, context) {
  let pattern = resolvePattern(context, mapvalue)
  emitter.findResubscribeProp(data, event, context, pattern, current, mapvalue)
}

exports.define = {
  subObj (data, event, obs, pattern, current, mapvalue, map) {
    var addedListener, incomplete
    pattern.each((field, key) => {
      let found
      if (key === 'upward') {
        found = this.subUp(data, event, obs, field, current, mapvalue, map)
      } else if (key === 'sub_parent') {
        let property = obs.parent
        if (property && !isRemoved(property)) {
          map[obs.key] = mapvalue
          found = this.subField(data, event, property, field, current, map)
        } else {
          obs.on('parent', [onParent, this, pattern, current, mapvalue, map], this.uid)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          map.parent = mapvalue
          found = this.subField(data, event, property, field, current, map)
        } else if (!addedListener) {
          let currentAttach = obs._on
            && obs._on.property
            && obs._on.property.attach
            && obs._on.property.attach[this.uid]
            
          if (currentAttach && typeof mapvalue === 'object') {
            merge(currentAttach[4], mapvalue)
          } else {
            obs.on('property', [onProperty, this, pattern, current, mapvalue, map], this.uid)
            obs.on('remove', [onRemove, this, pattern, current, mapvalue], this.uid)
          }
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

    obs.on('reference', [onReference, this, pattern, current, mapvalue, map], this.uid)
    let ref = reference(obs)
    if (ref) {
      return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, obs)
    }
  },

  subObjRef (data, event, obs, pattern, current, mapvalue, map, context) {
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
          obs.on('parent', [onParentRef, this, pattern, current, mapvalue, map, context], this.uid)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          found = this.subFieldRef(data, event, property, field, current, mapvalue, map, context)
        } else if (!addedListener) {
          let currentAttach = obs._on
            && obs._on.property
            && obs._on.property.attach
            && obs._on.property.attach[this.uid]
          if (currentAttach) {
            console.log('merging it')
            merge(currentAttach[4], mapvalue)
          } else {
            console.log('add listener', obs.path)
            obs.on('property', [onPropertyRef, this, pattern, current, mapvalue, map, context], this.uid)
            obs.on('remove', [onRemoveRef, this, current, mapvalue, context], this.uid)
          }
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

    obs.on('reference', [onReferenceRef, this, pattern, current, mapvalue, map, context], this.uid)
    let ref = reference(obs)
    if (ref) {
      return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, obs)
    }
  }
}

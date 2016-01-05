'use strict'
var parentListeners = require('./listeners/parent')
var removeListeners = require('./listeners/remove')
var incrementLevel = require('./current/inc/level')
var propListeners = require('./listeners/property')
var refListeners = require('./listeners/reference')
var anyListeners = require('./listeners/any')

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

var onAny = anyListeners.direct
var onAnyRef = anyListeners.reference

var Base = require('../../base')
var isRemoved = function (obs) {
  return obs._input === null
}

exports.define = {
  subObj (data, event, obs, pattern, current, mapvalue, map) {
    var id = this.uid + '.dir'
    var addedListener, incomplete

    for (let key in pattern) {
      let found
      if (key[0] === '_' || key === 'key') {
        continue
      } else {
        if (key === '$any') {
          let addedAnyListener
          obs.each((property, key) => {
            if (!pattern[key] && property && !isRemoved(property)) {
              map.parent = mapvalue
              pattern.setKey(key, pattern.$any)
              found = this.subField(data, event, property, pattern[key], current, map)
            }
          })
          if (!addedAnyListener) {
            let anyid = id + '_any'
            if (!mergeListener(obs, 'property', anyid, mapvalue)) {
              obs.on('property', [onAny, this, pattern, current, mapvalue, map], anyid, false, event)
              obs.on('remove', [onRemove, this, mapvalue, current], id, false, event)
            }
            addedAnyListener = true
          }
        } else if (key === '$condition') {
          let _fromCondition = this._fromCondition
          found = _fromCondition !== void 0
            ? _fromCondition
            : this.subCondition(data, event, obs, pattern, current, mapvalue, map)
          this._fromCondition = void 0
        } else if (key === '$upward') {
          this._fromUpward = obs
          found = this.subUp(data, event, obs, pattern[key], current, mapvalue, map)
          this._fromUpward = null
        } else if (key === '$parent') {
          let property = obs.parent
          if (property && !isRemoved(property)) {
            map[obs.key] = mapvalue
            found = this.subField(data, event, property, pattern[key], current, map)
          } else {
            obs.on('parent', [onParent, this, pattern, current, mapvalue, map], id + '_parent', false, event)
          }
        } else {
          let property = key === '$key' ? obs.key : obs[key]
          if (property && !isRemoved(property)) {
            if (property instanceof Base) {
              map.parent = mapvalue
              found = this.subField(data, event, property, pattern[key], current, map)
            } else {
              found = this.subFieldRef(data, event, property, pattern[key], current, mapvalue, map, obs)
            }
          } else if (!addedListener) {
            let propid = id + '_prop'
            if (!mergeListener(obs, 'property', propid, mapvalue)) {
              obs.on('property', [onProperty, this, pattern, current, mapvalue, map], propid, false, event)
              obs.on('remove', [onRemove, this, mapvalue, current], id, false, event)
            }
            addedListener = true
          }
        }
        if (!found) {
          incomplete = true
        }
      }
    }

    if (incomplete) {
      obs.on('reference', [onReference, this, pattern, current, mapvalue, map], id + '_ref', false, event)
      let ref = reference(obs)
      if (ref) {
        this.onSubHandler(event, pattern, ref, obs)
        return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, obs)
      }
    } else {
      return true
    }
  },

  onSubHandler (event, pattern, ref, obs) {
    if (ref.onSub) {
      if (this._fromUpward !== obs && !pattern._ignore) {
        let onRemove = this.onRemove
        if (onRemove) {
          onRemove.push(ref)
        } else {
          this.onRemove = [ref]
        }
        ref.onSub(event, this, pattern)
        return true
      }
    }
  },

  subObjRef (data, event, obs, pattern, current, mapvalue, map, context) {
    var id = this.uid + '.ref'
    var addedListener, incomplete
    for (let key in pattern) {
      let found
      if (key[0] === '_' || key === 'key') {
        continue
      } else if (key === '$any') {
        let addedAnyListener
        if (!addedAnyListener) {
          let anyid = id + '_any'
          if (!mergeListener(obs, 'property', anyid, mapvalue)) {
            obs.on('property', [onAnyRef, this, pattern, current, mapvalue, map, context], anyid, false, event)
            obs.on('remove', [onRemoveRef, this, current, mapvalue, context], id + '_rm', false, event)
          }
          addedAnyListener = true
        }
        obs.each((property, key) => {
          if (property && !isRemoved(property)) {
            map.parent = mapvalue
            pattern.setKey(key, pattern.$any)
            this.subFieldRef(data, event, property, pattern[key], current, mapvalue, map, context)
          }
        })
      } else if (key === '$condition') {
        let _fromCondition = this._fromCondition
        found = _fromCondition !== void 0
          ? _fromCondition
          : this.subCondition(data, event, obs, pattern, current, mapvalue, map)
        this._fromCondition = void 0
      } else if (key === '$upward') {
        found = this.subUpRef(data, event, obs, pattern[key], current, mapvalue, map, context)
      } else if (key === '$parent') {
        let property = obs.parent
        if (property && !isRemoved(property)) {
          found = this.subFieldRef(data, event, property, pattern[key], current, mapvalue, map, context)
        } else {
          obs.on('parent', [onParentRef, this, pattern, current, mapvalue, map, context], id + '_parent', false, event)
        }
      } else {
        let property = obs[key]
        if (property && !isRemoved(property)) {
          found = this.subFieldRef(data, event, property, pattern[key], current, mapvalue, map, context)
        } else if (!addedListener) {
          let propid = id + '_prop'
          if (!mergeListener(obs, 'property', propid, mapvalue)) {
            obs.on('property', [onPropertyRef, this, pattern, current, mapvalue, map, context], propid, false, event)
            obs.on('remove', [onRemoveRef, this, current, mapvalue, context], id + '_rm', false, event)
          }
          addedListener = true
        }
      }

      if (!found) {
        incomplete = true
      }
    }

    if (incomplete) {
      obs.on('reference', [onReferenceRef, this, pattern, current, mapvalue, map, context], id + '_ref', false, event)
      let ref = reference(obs)
      if (ref) {
        this.onSubHandler(event, pattern, ref, obs)
        return this.subObjRef(data, event, ref, pattern, incrementLevel(current), mapvalue, map, context)
      }
    } else {
      return true
    }
  }
}

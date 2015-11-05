'use strict'
var onReferenceDirect = function () {}
var onPropertyDirect = function () {}
var onParentDirect = function () {}
var getReferenced = function () {}
var incLateral = function () {}

module.exports = subscribeObjectDirect
// direct subcribeObject, doesn't care about references
function subscribeObjectDirect (data, event, obs, pattern, info, mapValue, map) {
  var addedListener, notComplete, key
  pattern.each((patternField, key) => {
    var found
    if (key === 'upward') {
      found = this.subscribeUpwardDirect(
        data,
        event,
        obs,
        patternField,
        info,
        mapValue,
        map
      )
    } else if (key === 'sub_parent') {
      let obsParent = obs.parent
      if (obsParent && obsParent._input !== null) {
        map[obs.key] = mapValue
        found = this.subscribeFieldDirect(
          data,
          event,
          obsParent,
          patternField,
          info,
          map
        )
      } else {
        obs.on('parent', [onParentDirect], key || (key = this.key))
      }
    } else {
      let obsProperty = obs[key]
      if (obsProperty && obsProperty._input !== null) {
        map.parent = mapValue
        found = this.subscribeFieldDirect(
          data,
          event,
          obsProperty,
          patternField,
          info,
          map
        )
      } else if (!addedListener) {
        obs.on('property', [onPropertyDirect], key || (key = this.key))
        addedListener = true
      }
    }

    if (!found) {
      notComplete = true
    }
  })

  if (notComplete) {
    let referenced = getReferenced(obs)
    obs.on('reference', [onReferenceDirect], key || (key = this.key))
    if (referenced) {
      // NOTE decided to always add reference listener, for when ref is added after the subscription
      return this.subscribeObjectReference(
        data,
        event,
        referenced,
        pattern,
        incLateral(info),
        mapValue,
        map
      )
    }
  } else {
    return true
  }
}

'use strict'
var getId = function () {}
var getLevel = function () {}
var getDistance = function () {}

module.exports = subscribeFieldReference

// reference subcribeValue, cares about references
function subscribeFieldReference (data, event, observable, patternField, info, mapValue) {
  var patternValue = patternField.val

  if (typeof patternValue === 'object') {
    return this.subscribeObjectReference(
      data,
      event,
      observable,
      patternValue,
      info,
      mapValue,
      {}
    )
  }

  let id
  if (patternValue === true) {
    id = this.generateId()
  } else {
    let prevDistance = getDistance(patternValue)
    if (prevDistance) {
      let currentDistance = getDistance(info)
      if (getDistance(info) < prevDistance) {
        id = getId(patternValue)
      } else if (prevDistance === currentDistance) {
        let prevRefLevel = getLevel(info)
        if (prevRefLevel) {
          if (getLevel(info) <= prevRefLevel) {
            id = getId(patternValue)
          }
        }
      }
    }
  }

  if (id) {
    // update the info with new id
    // and store it on the patternField
    if (data) {
      // emit it reference style
    }
    // add specific reference data listener
  }

  return true
}

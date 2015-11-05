'use strict'
var getId = function () {}
var getDistance = function () {}

module.exports = subscribeFieldDirect

// direct subscribeFieldDirect, doesn't care about references
function subscribeFieldDirect (data, event, observable, patternField, info, mapValue) {
  var patternValue = patternField.val

  if (typeof patternValue === 'object') {
    return this.subscribeObjectDirect(
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
      if (currentDistance <= prevDistance) {
        id = getId(patternValue)
      }
    }
  }

  if (id) {
    if (data) {
      // emit it
    }
    // add data listener
  }

  return true
}

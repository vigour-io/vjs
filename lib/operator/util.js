'use strict'
var Operator = require('./')

function getOperators () {
  var arr = []
  for (let i in this._properties) {
    let property = this._properties[i]
    if (property &&
      property.base &&
      property.base instanceof Operator) {
      // make override bit easier to use
      // add override support in here as well
      arr.push(i)
    }
  }
  return arr
}

exports.define = {
  // why not operator getter?
  getOperators: function () {
    if (this.hasOwnProperty('_operators')) {
      return this._operators
    }
    // negative values mean before
    // in here do the real operators stuff
    // make the operator follow order return operators on current thing
    let operators = getOperators.call(this)
    let found
    for (let i = 0, length = operators.length; i < length; i++) {
      if (this[operators[i]]) {
        if (!found) {
          found = []
        }
        found.push(this[operators[i]])
      }
    }
    if (found) {
      found.sort(function (a, b) {
        return a._order < b._order ? -1 : a._order > b._order ? 1 : 0
      })
      this._operators = found
      return found
    }
  }
}

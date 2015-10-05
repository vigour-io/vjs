'use strict'
var Operator = require('./')

function getOperators () {
  var arr = []
  for (var i in this._properties) {
    var property = this._properties[i]
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
  // why not operators getter?
  getOperators: function () {
    if (this.hasOwnProperty('_operators')) {
      return this._operators
    }
    // negative values mean before
    // in here do the real operators stuff
    // make the operator follow order return operators on current thing
    var operators = getOperators.call(this)
    var rOperators
    for (var i = 0, length = operators.length; i < length; i++) {
      if (this[operators[i]]) {
        if (!rOperators) {
          rOperators = []
        }
        rOperators.push(this[operators[i]])
      }
    }
    if (rOperators) {
      rOperators.sort(function (a, b) {
        console.log('??', a._order)
        return a._order < b._order ? -1 : a._order > b._order ? 1 : 0
      })
      console.log(rOperators)
      this._operators = rOperators
      return rOperators
    }
    this._operators = false
  }
}

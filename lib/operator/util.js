'use strict'
var Operator = require('./')

exports.define = {
  // param input / output
  getOperators: function () {
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
  },
  hasOperators: function () {
    var operators = this.getOperators()
    for (var i = 0, length = operators.length; i < length;i++) {
      if (this[operators[i]]) {
        return operators
      }
    }
  }
}

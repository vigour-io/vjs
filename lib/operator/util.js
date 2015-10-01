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
        arr.push(i)
      }
    }
    return arr
  },
  hasOperators: function () {
    // finding for props
    // var obs = this.getProperty(key)
    // console.log(obs)
    // return obs
  }
}

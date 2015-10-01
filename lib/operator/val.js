'use strict'
var parseValue = require('../base').prototype.parseValue

exports.define = {
  parseValue: function (previousValue, origin) {
    var val = parseValue.call(this, previousValue, origin)
    var operator = this.Operator.prototype
    if (operator.hasOperators(this)) {
      var operators = operator.operators
      for (var key in this) {
        if (operators[key]) {
          operator = this[key]
          val = operator._operator.call(this, val, operator, origin)
        }
      }
    }
    return val
  }
}

// here we can inject all operators (easy)

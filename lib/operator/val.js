'use strict'
var parseValue = require('../base').prototype.parseValue

exports.inject = require('./util')
// -----------------------------
exports.define = {
  parseValue: function (previousValue, origin) {
    var val = parseValue.call(this, previousValue, origin)
    var operator
    var operators = this.getOperators()
    if (operators) {
      for (var i in operators) {
        operator = operators[i]
        // do it now!
        // this call needs to be based on bind (just like emit fn)
        var bind = operator.getBind()
        if (bind) {
          val = operator._operator.call(bind, val, operator, origin)
        }
      }
    }
    return val
  }
}

// here we can inject all operators (easy)

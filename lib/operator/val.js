'use strict'
var parseValue = require('../base').prototype.parseValue
// -----------------------------
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

        if (operator._parent !== this) {
          operator._context = this
          operator._contextLevel = 1
        } else if (this._context) {
          operator._context = this._context
          operator._contextLevel = this._contextLevel + 1
        }
        // do it now!
        // this call needs to be based on bind (just like emit fn)
        var bind = operator.getBind()
        // console.error(this)
        // if (bind) {
        val = operator._operator.call(bind, val, operator, origin)
        // }
      }
    }
    return val
  }
}

// here we can inject all operators (easy)

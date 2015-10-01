'use strict'
var parseValue = require('../base').prototype.parseValue
var Base = require('../base')
// -----------------------------
// now here is the crux of all work
// val nees to care about input and ouput
// input is a parse value function thats called before
// take output into acount

// later reuse more things with val
// now make it as it should be
/*
  input
    operators
  ---ouput---
  operators
  order
  how to do this efficently?
  operator can be done with property check dont need special system
*/


// -----------------------------
exports.define = {
  parseValue: function (previousValue, origin) {
    var val = parseValue.call(this, previousValue, origin)
    var operator
    var operators = this.getOperators && this.getOperators()
    if (operators) {
      for (var i in operators) {
        operator = operators[i]
        // do it now!
        // this call needs to be based on bind (just like emit fn)
        val = operator._operator.call(this, val, operator, origin)
      }
    }
    return val
  }
}

// here we can inject all operators (easy)

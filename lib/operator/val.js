'use strict'
// var parseValue = require('../base').prototype.parseValue
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
function parseValue (previousValue, origin) {
  if (!origin) {
    origin = this
  }
  var val = this.output || this._input
  if (val) {
    if (typeof val === 'function') {
      // make this into a funciton e.g. execGetterFunction bindGetter
      var bind = this._bind || this
        // (this._bind.output || this._bind._input) ||
        // this
        // this is still totaly wrong

      if (bind) {
        if (typeof bind === 'function') {
          // send val as well -- take previous val into account in parseValue
          bind = bind.call(this, previousValue)
        } else if (bind === 'parent') {
          // this will be replaced with a general path functionality (that includes)
          bind = this.parent
        } else {
          bind = this
        }
      }
      val = val.call(bind, previousValue)
    } else if (val instanceof Base) {
      if (val !== origin) {
        val = val.parseValue(void 0, origin)
      } else {
        console.warn(
          'parsingValue from same origin (circular)',
          'path:', this.path,
          'origin:', origin.path
        )
      }
    } else {
      val = this.output || this._input
    }
  }

  if (val === void 0) {
    val = this
  }

  return val
}

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
        val = operator._operator.call(this, val, operator, origin)
      }
    }
    return val
  }
}

// here we can inject all operators (easy)

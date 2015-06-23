"use strict";
// operator.js
var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

var operator = new Base({
  $bind:'$parent',
  $flags: {
    $operator: function(val) {
      //wrap funky stuff here
      this._$operators[this._$key] = true
      this._$operator = val
    }
  }
})

define( operator, '$hasOperators', {
  value: function( base ) {
    for(var key$ in this._$operators) {
      if(base[key$]) {
        return true
      }
    }
  }
})

operator._$operators = {}

var Operator = module.exports = operator.$Constructor 

//move this later
require('./operators.js')


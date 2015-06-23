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

var update = operator.$update

define( operator, '$hasOperators', {
  value: function( base ) {
    for(var key$ in this._$operators) {
      if(base[key$]) {
        return true
      }
    }
  }
})

define( operator, '$update', {
  value:function(type, event) {
    //operators have to push change events up the chain (until they reach a non-Operator)
    var parent
    if(event && type === '$change' && ( parent = this.$parent)) {
      var dispatcher 

      while(parent) {
        var on = parent.$on
        dispatcher = on && on[type]
        if(parent instanceof Operator) {
          if(dispatcher) {
            event.$postpone(dispatcher)
          }
          parent = parent.$parent
        } else {
          parent = void 0
        }
      }
      
      if(dispatcher) {
        event.$postpone(dispatcher)      
      }   
    }

    update.apply(this, arguments)
  }
})

operator._$operators = {}

var Operator = module.exports = operator.$Constructor 

//move this later (.$.inject())
require('./operators.js')


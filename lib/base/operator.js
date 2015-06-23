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

var update = operator.$update

var Operator = module.exports = operator.$Constructor 

define( operator, '$update', {
  value:function(type, event) {
    //operators have to push change events up the chain (until they reach a non-Operator)
    var parent
    if(event && type==='$change' && ( parent = this.$parent)) {
      var dispacther 
      while(parent) {
        dispacther = parent.$on && parent.$on.$change
        if(!dispacther && parent instanceof Operator) {
          parent = parent.$parent
        } else {
          parent = void 0
        }
      }
      if( dispacther ) {
        if(!event.$postponed) {
          event.$postponed = []
        }
        //have to bind the correct parent (instances problems)
        event.$postponed.push(dispacther)       
      }   
    }
    update.apply(this, arguments)
  }
})

operator._$operators = {}

//move this later
require('./operators.js')


"use strict";

var Base = require('../../')
var define = Object.defineProperty
var proto = Base.prototype

var operator = new Base({
  $bind:'$parent',
  $flags: {
    $operator: function(val) {
      //wrap some more funky stuff here or make it easier to make result operators for obj
      this._$operators[this._$key] = true
      this._$operator = val
    }
  }
  // $useVal:true
})

var emit = operator.$emit

define( operator, '$hasOperators', {
  value: function( base ) {
    for(var key$ in this._$operators) {
      if(base[key$]) {
        return true
      }
    }
  }
})

define( operator, '$emit', {
  value:function(type, event) {
    //operators have to push change events up the chain (until they reach a non-Operator)
    var parent
    if(event && type === '$change' && ( parent = this.$parent) ) {
      var emitter 
      // var pp

      while(parent) {
        var on = parent.$on
        emitter = on && on[type]
        // pp = parent
        if(parent instanceof Operator) {
          if(emitter) {
            event.$postpone(emitter)
          }
          parent = parent.$parent
        } else {
          parent = void 0
        }
      }
      
      if(emitter) {
        // pp._$lastChange = event.$stamp
        // parent._$lastChange = event.$stamp
        event.$postpone(emitter)      
      }   
    }

    emit.apply(this, arguments)

  }
})

define( operator, '$getResults', {
  value: function(obj) {
    if(!obj.$results) {
      obj.$results = new Results({}, false, obj)
    }
    return obj.$results
  }
})

operator._$operators = {}

var Operator = module.exports = operator.$Constructor 

//move this later (.$.inject())
require('./operators')


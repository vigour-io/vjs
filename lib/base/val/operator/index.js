"use strict";

var Base = require('../../')
var define = Object.defineProperty
var proto = Base.prototype
var emit = proto.$emit
var Results = require('./results')

var Operator = module.exports = new Base({
  $bind:'$parent',
  $flags: {
    $operator: function(val) {
      //wrap some more funky stuff here or make it easier to make result operators for obj
      this._$operators[this._$key] = true
      this._$operator = val
    }
  },
  $define: {
    $hasOperators:function( base ) {
      for(var key$ in this._$operators) {
        if(base[key$]) {
          return true
        }
      }
    },
    $emit: function(type, event) {
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
    },
    $getResults: function(obj) {
      if(!obj.$results) {
        obj.$results = new Results({}, false, obj, '$results')
      }
      return obj.$results
    },
    _$operators: {
      value:{}
    }
  }
}).$Constructor 
//make this by default not get an event
//new without event does not need to create an event

//move this later (.$.inject())
require('./operators')


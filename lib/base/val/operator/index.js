"use strict";

var util = require('../../../util')
var Base = require('../../')
var define = Object.defineProperty
var proto = Base.prototype
var emit = proto.$emit
var Results = require('./results')

var Operator = module.exports = new Base({
  $bind:'$parent',
  $flags: {
    $operator: function( val ) {
      //wrap some more funky stuff here or make it easier to make result operators for obj
      this.$operators[this._$key] = true
      //maybe make this inheritable?
      this._$operator = val
    }
  },
  $define: {
    $hasOperators:function( base ) {
      for(var key$ in this.$operators) {
        if(base[key$]) {
          return true
        }
      }
    },
    $emit: function( type, event ) {
      //operators have to push change events up the chain (until they reach a non-Operator)
      var parent
      if(event && type === '$change' && ( parent = this.$parent) ) {
        var emitter 
        while(parent) {
          var on = parent.$on
          emitter = on && on[type]
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
          event.$postpone(emitter)      
        }   
      }
      emit.apply(this, arguments)
    },
    $getResults: function(base, val) {

      var operator = Operator.prototype
      
      // console.log('>>>>', operator.$operators)

      if(!base.$results) {
        var results = base.$results = new Results({}, false, base)
        if(val) {
          if(util.isPlainObj(val)) {
            forEach(val, function(field, key ) {
              results.$setKey( key, field, false )
            })
          } else if(val instanceof Base) {
            val.$each(function(field, key) {
               results.$setKey(key, field, false)
            }, function(field) {
              return !operator.$operators[field]
            })
          }
        }
      }
      return base.$results
    },
    $operators: {
      value:{},
      writable:true
    }
  }
}).$Constructor 
//make this by default not get an event
//new without event does not need to create an event

//move this later (.$.inject())
require('./operators')


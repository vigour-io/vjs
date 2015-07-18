"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../util')
var Base = require('../base')
var Observable = require('../observable')
var List = require('../list')
var proto = Observable.prototype
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
    $makeResults: function(val, copy, list) {
      var operator = this
      var isList = list || val instanceof List
      var Type = isList ? List : Base
      var results = operator._results = new Type(void 0, void 0, operator)
      results._$key = '$results'
      // TODO: check if this makes sense
      if(copy && val) {
        if(isList) {
          // TODO: make faster way to push all fields?
          if(val) {
            if(util.isPlainObj(val)) {
              forEach(val, function(value, key ) {
                results.$push( value )
              })
            } else if(val instanceof Base) {
              val.each(
                function(value, key) {
                  results.$push( value )
                }, 
                function(key) {
                  return operator.$operators[key]
                }
              )
            }
          }
        } else {
          if(util.isPlainObj(val)) {
            forEach(val, function(field, key ) {
              results.$setKey( key, field, false )
            })
          } else if(val instanceof Base) {
            val.each(function(field, key) {
               results.$setKey(key, field, false)
            }, function(field) {
              return operator.$operators[field]
            })
          }
        }
      }
      return results
    },
    $operators: {
      value:{},
      writable:true
    }
  }
}).$Constructor 


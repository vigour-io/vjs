"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../util')
var Base = require('../base')
var Observable = require('../observable')
var List = require('../list')
var proto = Observable.prototype
var emit = proto.emit
var Results = require('./results')
var Event = require('../event')

var Operator = module.exports = new Observable({
  $bind:'$parent',
  $flags: {
    $operator: function( val ) {
      //wrap some more funky stuff here or make it easier to make result operators for obj
      this.$operators[this.$key] = true
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
    emit: function( type, event ) {
      //operators have to push change events up the chain (until they reach a non-Operator)
      var parent

      //!double check if this is nessecary!
      // if( event === void 0 ) {
      //   event = new Event( this )
      // }

      if( event && type === '$change' && ( parent = this.$parent) ) {
        var emitter
        while(parent) {
          var on = parent.$on
          emitter = on && on[type]
          if(parent instanceof Operator) {
            if( emitter ) {
              parent.emit( type, event )
              // event.$postpone( emitter )
            }
            parent = parent.$parent
          } else {
            parent.emit( type, event )
            parent = void 0
          }
        }
      }

      emit.call( this, type, event )
    },
    $makeResults: function(val, copy, list) {
      var operator = this
      var isList = list || val instanceof List
      var Type = isList ? List : Base
      var results = operator._results = new Type(void 0, void 0, operator)
      results.$key = '_results'
      results._$operated = val

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
              results.setKey( key, field, false )
            })
          } else if(val instanceof Base) {
            val.each(function(field, key) {
               results.setKey(key, field, false)
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

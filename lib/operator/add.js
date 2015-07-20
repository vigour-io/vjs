"use strict";

var forEach = require('lodash/collection/forEach')
var Base = require('../base')
var Observable = require('../observable')
var List = require('../list')
var Operator = require('./')

exports.$inject = require('./shared')

exports.$flags = {
  $add: new Operator({
    $key: '$add',
    $operator: function( val, operator, origin ) {

      console.log('++++++++++++++ add!')

      if(typeof val === 'object') {
        operator._result = null

        if(!operator._results) {
          // console.log('make results')

          var results = operator.$makeResults(val, true)
          var operatorVal = operator.$parseValue(val, origin)

          if(results instanceof List) {
            if(typeof operatorVal === 'object') {
              if(operatorVal instanceof Base) {
                operatorVal.each(
                  function(value, key){
                    results.$push(value)
                  }, 
                  function(key) {
                    return operator.$operators[key]
                  }
                )
              } else {
                forEach(operatorVal, function(value, key ) {
                  results.$setKey(key, value)
                })
              }
            }else{
              results.$push(operatorVal)
            }
          } else {
            if(typeof operatorVal === 'object') {
              if(operatorVal instanceof Base) {
                operatorVal.each(
                  function(value, key){
                    results.$setKey(key, value)
                  }, 
                  function(key) {
                    return operator.$operators[key]
                  }
                )  
              } else {
                forEach(operatorVal, function(value, key ) {
                  results.$setKey(key, value)
                })
              }
            } else {
              results.$setKey('addOnResult', operatorVal)
            }
          }

          // TODO: make sure that results stay up to date!

          if(val instanceof Observable) {

            // val.on('$property', function(event, delta){
            //   console.log('---------- $delta in add', delta)
              

            // })

            val.on('$delta', function(event, delta){
              console.log('---------- $delta in add', delta)
              // results.$applyDelta(delta)
              // results.$emit('$delta', delta)
            })

          }

        } else {
          console.log('already made results!')
        }

        return operator._results

      } else {
        if(this.$results) {
          console.error('have $results, remove?')
        }
        var stamp = this.$stamp
        var resultStamp = operator._resultStamp
        if(stamp !== resultStamp || !resultStamp) {
          var operatorVal = operator.$parseValue( val, origin )
          operator._result = val + operatorVal
          operator.resultStamp = stamp
        }
        return operator._result
      } 
    }
  })
}


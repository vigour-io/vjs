"use strict";

var forEach = require('lodash/collection/forEach')
var Base = require('../base')
var List = require('../list')
var Operator = require('./')

var add = new Operator({
  $key: '$add',
  $operator: function( val, operator, origin ) {
    console.error('???', val)

    if(typeof val === 'object') {
      operator._result = null
      console.error('!!!')
      if(!operator._results) {

        var results = operator.$makeResults(val, true)
        var toAdd = operator.$parseValue( val, origin )

        if(results instanceof List) {
          if(typeof toAdd === 'object') {
            if(toAdd instanceof Base) {
              toAdd.each(
                function(value, key){
                  results.$push(value)
                }, 
                function(key) {
                  return !operator.$operators[key]
                }
              )
            } else {
              forEach(toAdd, function(value, key ) {
                results.$setKey(key, value)
              })
            }
          }else{
            results.$push(toAdd)
          }
        } else {
          if(typeof toAdd === 'object') {
            if(toAdd instanceof Base) {
              toAdd.each(
                function(value, key){
                  results.$setKey(key, value)
                }, 
                function(key) {
                  return !operator.$operators[key]
                }
              )  
            } else {
              forEach(toAdd, function(value, key ) {
                results.$setKey(key, value)
              })
            }
          } else {
            results.$setKey('addOnResult', toAdd)
          }
        }

        // TODO: make sure that results stay up to date!

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
}).$Constructor

//-----------injectable part of the module----------

exports.$flags = {
  $add: add
}

exports.$inject = [
  require('./val'),
  require('../methods/each')
]

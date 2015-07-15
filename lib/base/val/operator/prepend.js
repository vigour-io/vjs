"use strict";

var forEach = require('lodash/collection/forEach')

var util = require('../../../util')
var Base = require('../../')
var Operator = require('./')
var Results = require('./results')

module.exports = new Operator({
  $key: '$prepend',
  $operator: function( val, operator, origin ) {
      
    //cache met EVENT! 
    if(typeof val === 'object') {

      console.log('oh noes prepending to opbjecnt')

      var results = operator.$getResults(this, val, true)
      var toAdd = operator.$parseValue(val, origin)

      // clean up list, check if all items are supposed to be there
      // this will get slow fast!
      results.$each(function(value, key) {
        // think of something!
      })

      if(typeof toAdd === 'object') {
        console.log('prepend object', toAdd)

        // prepending objects / arrays can be faster with splice
        if(toAdd instanceof Base) {
          toAdd.$each(function(value, key){
            // need to pass event here?
            results.$unshift(value)
          })  
        } else {
          forEach(toAdd, function(value, key ) {
            // need to pass event here?
            results.$unshift(value)
          })
        }
      } else {
        console.log('prepend value', toAdd)
        results.$unshift(toAdd)
      }

      return results
    } else {
      if(this.$results) {
        console.error('have $results, remove?')
      }
      var stamp = this.$stamp
      var resultStamp = operator._resultStamp
      if(stamp !== resultStamp || !resultStamp) {
        var operatorVal = operator.$parseValue( val, origin )
        operator._result = operatorVal + val 
        operator.resultStamp = stamp
      }
      return operator._result
    }
  }
}).$Constructor
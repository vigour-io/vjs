"use strict";

var forEach = require('lodash/collection/forEach')

var util = require('../../../util')
var Base = require('../../')
var List = require('../../list')
var Operator = require('./')
var Results = require('./results')

module.exports = new Operator({
  $key: '$add',
  $operator: function( val, operator, origin ) {
    //cache met EVENT! 

    if(typeof val === 'object') {
      console.error('urrr object')

      operator._result = null

      if(!operator._results) {
        console.log('make results')

        var results = operator.$makeResults(val, true)
        var toAdd = operator.$parseValue( val, origin )


        // now add those toadd fields dammit
        if(typeof toAdd === 'object') {
          if(toAdd instanceof Base) {
            toAdd.$each(function(value, key){
              results.$setKey(key, value)
            })  
          } else {
            forEach(toAdd, function(value, key ) {
              results.$setKey(key, value)
            })
          }
        } else {
          results.$setKey('addOnResult', toAdd)
        }
        




        // what will the toString look like? parent? path?        
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
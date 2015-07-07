"use strict";

var forEach = require('lodash/collection/forEach')

var util = require('../../../util')
var Base = require('../../')
var Operator = require('./')
var Results = require('./results')


module.exports = new Operator({
  $key: '$add',
  $operator: function( val, operator, origin ) {
    //cache met EVENT! 
    if(typeof val === 'object') {
      var results = operator.$getResults(this, val)
      var toAdd = operator.$parseValue( val, origin )

      results.$each(function(value, key) {
        if(!val[key] && !(toAdd && toAdd[key])) {
          console.warn('REMOVE!', key)
          // value.$remove()
        }
      })

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
      return results
    }
    return val + operator.$parseValue( val, origin )
  }
}).$Constructor
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

      var results = operator.$getResults(this, val)

      var properties = []
      
      results.$each(function(value, key){
        console.log('already haf', key)
        properties.push([key, value])
        delete results[key]
      })

      var toAdd = operator.$parseValue(val, origin)

      if(typeof toAdd === 'object') {
        results.$each(function(value, key) {
          if(!toAdd[key] && !val[key]) {
            console.warn('REMOVE!', key)
            // value.$remove()
          }
        })
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
        results.$setKey('prependOnResult', toAdd)
      }

      // put back previous values
      for(var i = 0, l = properties.length ; i < l ; i++) {
        var property = properties[i]
        results.$setKey(property[0], property[1])
      }

      return results
    }
    return operator.$parseValue( val, origin ) + val
  }
}).$Constructor
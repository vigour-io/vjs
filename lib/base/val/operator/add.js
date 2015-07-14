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
      console.error('urrr object')
      var results = operator.$getResults(this, val)
      var toAdd = operator.$parseValue( val, origin )

      // this needs to work with delta:
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
    } else {

      
      var stamp = this.$stamp

      var stamp = this.$on && this.$on.$change && this.$on.$change.$lastStamp
      console.log('stamp', stamp)

      var cacheStamp = operator._cacheStamp

      console.log('cacheStamp', cacheStamp)

      if(stamp !== cacheStamp) {

        console.error('----------> calculate!')

        operator._cache = val + operator.$parseValue(val, origin)
        operator._cacheStamp = stamp
      }

      return operator._cache


    }
    
  }
}).$Constructor
"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../util')
var Operator = require('./')
var Results = require('./results')

exports.$inject = require('./shared')

exports.$flags = {
  $map: new Operator({
    $key: '$map',
    $operator: function( val, operator, origin ) {

      var results = operator.$getResults(this)
      var map = operator._$input

      if(util.isPlainObj( val )) {
        forEach( val, function( value, key ) {
          results.setKey( key, map( value, key, false ) )
        })
      } else {
        val.each(
          function( value, key ) {
            var result = map( value, key )
            if( result !== void 0 && result !== null) {
              //ff dingen weghalen ook hiero
              //only set this
              //different dan clear
              results.setKey(key, result, false)
            } else {
              // results.setKey( key, 'go away!' )
              console.log('===> REMOVE', key)
              //REMOVE KEY!
            }
          }, 
          function(key) {
            return operator.$operators[key]
          }
        )
      }
      return results
    }
  })
}



"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../../../util')
var Operator = require('./')
var Results = require('./results')

module.exports = new Operator({
  $key: '$map',
  $operator: function( val, operator, origin ) {
    var results = operator.$getResults(this)
    if(util.isPlainObj( val )) {
      forEach( val, function( property, key ) {
        results.$setKey( key, operator._$val( property, key, false ) )
      })
    } else {
      val.$each(
        function( property, key ) {
          var result = operator._$val( property, key )
          if( result !== void 0 && result !== null) {
            //ff dingen weghalen ook hiero
            //only set this
            //different dan clear
            results.$setKey(key, result, false)
          } else {
            // results.$setKey( key, 'go away!' )
            console.log('===> REMOVE', key)
            //REMOVE KEY!
          }
        }, 
        function(key) {
          return !operator._$operators[key]
        }
      )
    }
    return results
  }
}).$Constructor

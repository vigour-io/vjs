"use strict";

var util = require('../../../util')
var Base = require('../../')
var Operator = require('./')
var Results = require('./results')

module.exports = new Operator({
  $key: '$add',
  $operator: function( val, operator, origin ) {
    
    //cache met EVENT!
    if(typeof val === 'object') {
      var results = operator.$getResults(this)
      if(util.isPlainObj(val)) {
        forEach(val, function(field, key ) {
          results.$setKey( key, field, false )
        })
      } else if(val instanceof Base) {
        val.$each(function(field, key) {
           results.$setKey( key, field, false ) 
        }, function(field) {
          return !operator.$operators[field]
        })
      }

      val = operator.$parseValue( val, origin )

      if(val === operator) {
        operator.$each(function(field, key) {
          results.$setKey( key, field )
        })
      } else {
        results.$setKey( 'addOnResult', val, false )
      }
      return results
    }

    return val + operator.$parseValue( val, origin )
  }
}).$Constructor
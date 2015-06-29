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
      var results = operator.$getResults(this, val)

      val = operator.$parseValue( val, origin )


      

      
      if(val === operator) {

        operator.$each(function(field, key) {
          results.$setKey( key, field )
        })

      } else if(val === operator.$results) {
        operator.$results.$each(function(property, key) {
          results.$setKey( key, property )
        })
      } else {

        results.$setKey( 'addOnResult', val, false )

      }
      return results
    }

    return val + operator.$parseValue( val, origin )
  }
}).$Constructor
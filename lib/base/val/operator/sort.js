"use strict";

var forEach = require('lodash/collection/forEach')

var util = require('../../../util')
var Base = require('../../')
var Operator = require('./')
var Results = require('./results')

module.exports = new Operator({
  $key: '$sort',
  $operator: function( val, operator, origin ) {
    //cache met EVENT! 
    if(typeof val === 'object') {
      
      var results = operator.$getResults(this, val, true)

      var params = operator.$parseValue( val, origin )

      results.$$sort(params)

      return results
    } else {
      console.error('how ya want me to sort', val, 'ya foo!')
    }

    return val
  }
}).$Constructor
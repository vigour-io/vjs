"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../util')
var Observable = require('../observable')
var Operator = require('./')
var Results = require('./results')

exports.$inject = require('./shared')

exports.$flags = {
  $sort: new Operator({
    $key: '$sort',
    $operator: function( val, operator, origin ) {
      if(typeof val === 'object') {
        var results = operator.$makeResults( val, true, true )
        var params = operator.$parseValue( val, origin )

        var subsObj = new Observable()
        results.sort( params, subsObj )

        console.log('sorted, lets keep it up to date!', subsObj)

        val.$subscribe(subsObj, {
          $change: function(event, meta) {
            console.error('sort listener!!', this, event, meta)
            // results.$$sort( params, event )
          }
        })

        return results
      } else {
        console.error('how ya want me to sort', val, 'ya foo!')
      }

      return val
    }
  })
}

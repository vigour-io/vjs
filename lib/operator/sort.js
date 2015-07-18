"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../util')
var Observable = require('../observable')
var Operator = require('./')
var Results = require('./results')
var isEmpty = util.isEmpty

exports.$inject = require('./shared')

exports.$flags = {
  $sort: new Operator({
    $key: '$sort',
    $operator: function( val, operator, origin ) {



      if(typeof val === 'object') {

        var operated = this

        var results = operator.$makeResults( val, true, true )
        var params = operator.$parseValue( val, origin )

        var subsObj = new Observable()
        results.sort( params, subsObj )

        console.log('sorted, lets keep it up to date!', subsObj)
        if(val instanceof Observable) {
          val.$subscribe(subsObj, {
            $change: function(event, meta) {
              console.error('sort listener!!', this, event, meta)
              var moved = results.sort(params, null, event)
              console.log('hur haha moved!', moved)
              if(moved) {
                results.$emit('$operatorChain', event, moved)
              }
              // 
            }
          })
          val.on('$operatorChain', function(event, delta){
            console.log('omg an operator before me is kicking me!')
          })
        }
        

        return results
      } else {
        console.error('how ya want me to sort', val, 'ya foo!')
      }

      return val
    }
  })
}

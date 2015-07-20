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

      console.log('++++++++++++++ sort!')

      if(typeof val === 'object') {

        var operated = this

        var results = operator.$makeResults( val, true, true )
        var operatorVal = operator.$parseValue( val, origin )

        var subsObj = new Observable()
        results.sort( operatorVal, subsObj )

        console.log('sorted, lets keep it up to date!', subsObj)
        if(val instanceof Observable) {
          val.on('$property', function(event, meta){

            var removed = meta.removed
            if(removed) {
              // loop through results, remove dead ends
            }

            var added = meta.added
            if(added) {
              for(var a in added) {
                var add = val[added[a]]
                results.$push(add)
              }  
            }

            // dont care about moved

          })
          val.$subscribe(subsObj, {
            $change: function(event, meta) {
              console.error('sort listener!!', this, event, meta)

              console.log('list is now', window.raw(results))

              var moved = results.sort(operatorVal, null, event)

              console.log('hur haha moved!', moved)

              if(moved) {
                results.$emit('$delta', event, {moved: moved})
              }

              console.log('list is now', window.raw(results))

              // 
            }
          })

          val.on('$moved', function(event, delta){
            console.log('SORT: there is a delta handle it')

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

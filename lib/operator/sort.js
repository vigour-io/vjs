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

        var eventCache = {}

        if(val instanceof Observable) {
          val.on('$property', function( event, delta ) {
            console.error('--------- !! sort Listener ($property) !!', delta)

            eventCache.event = event
            var newdelta = eventCache.delta = {}
            
            var removed = delta.removed
            if(removed) {
              newdelta.removed = removed
              // loop through results, remove dead ends
              // push removed keys in 
            }

            var added = delta.added
            if(added) {
              newdelta.added = added
              var pushed = []
              for(var i = 0, l = added.length ; i < l ; i++) {
                pushed.push(val[added[i]])
              }
              pushed.push(null)
              results.$push.apply(results, pushed)

              // for(var a in added) {
              //   var add = val[added[a]]
              //   results.$push(add, null)
              // }
            }

            // dont care about moved

          })
          val.$subscribe(subsObj, {
            $change: function(event, delta) {
              console.error('--------- !! sort Listener ($change) !!')

              console.log('list is now', window.raw(results))

              var moved = results.sort(operatorVal, null, event)

              console.log('hur haha moved!', moved)

              if(moved) {

                console.log('\n\n\nhey wexmex fire property event!', moved, eventCache.event === event)

                
                // results.$emit('$delta', event, {moved: moved})
              }

              var delta
              if(eventCache.event === event) {
                console.log('-------- get delta from property', eventCache.delta)
                delta = eventCache.delta
                delta.moved = moved
              } else if(moved) {
                delta = { moved: moved }
              }
              if(delta) {
                results.$emit('$property', event, delta)
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

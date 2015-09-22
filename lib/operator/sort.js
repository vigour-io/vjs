'use strict'

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
    $operator: function ( val, operator, origin ) {
      if (typeof val === 'object') {
        var operated = this

        var results = operator.$makeResults(val, true, true)
        var operatorVal = operator.$parseValue(val, origin)

        var subsObj = new Observable()
        results.sort(operatorVal, subsObj)

        var eventCache = {}

        if (val instanceof Observable) {
          // val.on('$change')

          var propHandler = createPH(eventCache, results, val)

          val.on('$property', [propHandler, operator], false,
            function operatorCompare (compare) {
              return compare[1] !== operator
            }
          )

          val.$subscribe(subsObj, {
            $change: function (event, delta) {
              console.error('--------- !! sort Listener ($change) !!', event.toString(), delta)

              var moved = results.sort(operatorVal, null, event)

              if (moved) {
                // results.emit('$delta', event, {moved: moved})
              }

              var delta
              if (eventCache.event === event) {
                delta = eventCache.delta
                delta.moved = moved
              } else if (moved) {
                delta = { moved: moved }
              }
              if (delta) {
                results.emit('$property', event, delta)
              }

            }
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

function createPH (eventCache, results, val) {
  return function propertyHandler ( event, delta ) {
    console.error('--------- !! sort Listener ($property) !!', event.toString(), delta)

    eventCache.event = event
    var newdelta = eventCache.delta = {}

    var removed = delta.removed
    if (removed) {
      newdelta.removed = removed

      var removes = removed.length
      var found = 0

      results.each(function (value, key) {
        var target = value._$input
        if (target._$input === null) {
          console.warn('yes this is remose', key)

          results.$splice(key, 1, event)

          return (++found === removes)

        }
      })

    // loop through results, remove dead ends
    // push removed keys in 
    }

    var added = delta.added
    if (added) {
      newdelta.added = added
      var pushed = []
      for (var i = 0, l = added.length; i < l; i++) {
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

  }
}

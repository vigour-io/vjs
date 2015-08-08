"use strict";

var forEach = require('lodash/collection/forEach')
var util = require('../util')
var Base = require('../base')
var Observable = require('../observable')
var Operator = require('./')
var Results = require('./results')
var makeTest = require('../util/test').makeTest

exports.$inject = require('./shared')

exports.$flags = {
  $filter: new Operator({
    $key: '$filter',
    $operator: function( val, operator, origin ) {
      //cache met EVENT!

      console.log('++++++++++++++ filter!')

      if(typeof val === 'object') {

        if(!operator._results) {
          var results = operator.$makeResults(false, false, true)

          var operatorVal = operator.$parseValue(val, origin)
          // console.log('subscribe to', operatorVal)
          var subsObj = new Observable()
          var itemTest = makeTest(operatorVal, subsObj)


          if(util.isPlainObj( val )) {
            forEach( val, forProperties)
          } else {
            val.each(
              forProperties,
              function(key) {
                return operator.$operators[key]
              }
            )
          }

          function forProperties(value, key) {

            console.error('==================== item', key, value)

            var check = itemTest(value)
            console.log('checks out?', check, 'wex')

            var resultsRef

            if(check) {
              console.log('1 >>>>>>> push it in thur')
              results.$push(value) // TODO: if sorted use $splice
              resultsRef = results[results.length-1]
            }

            // if order matters we need to determine if this filter results is sorted (before filtered) to know if we need to re-sort / splice when items are added

            if(value instanceof Observable) {

              //DEZE IS ER NOG NIET!

              value.$subscribe(subsObj, {
                $change: function filterListener(event) {
                  console.error('--------- !! filterListener !!')
                  var check = itemTest(value)
                  console.log('checks out?', check)
                  if(check) {
                    if(!resultsRef) { // checks out but not in
                      console.log('checks out but not in')
                      console.log('2 >>>>>>> push it in thur')
                      results.$push(value, event)
                      resultsRef = results[results.length-1]
                    }
                  } else {
                    if(resultsRef) { // does not check out but is in
                      console.log('does not check out but is in')
                      var key = resultsRef.$key

                      console.warn('I HAVE TO CLEAN THIS THING')

                      results.$splice(key, 1, event)
                      resultsRef = null
                    }
                  }
                }
              })
            }
          }
        }

        return operator._results

        var results = operator.$getResults(this, void 0, true)

        // TODO: find a good way to handle existing results
        // for now: only apply filter once

        // if(results.length) {
        //   results.$reset()
        // }

        var subsObj = new Observable()
        // console.log('\n\n====================== make itemTest')
        var itemTest = makeTest(operator, subsObj)
        // console.log('====================== made itemTest\n\n')

        console.log('subsObj:', subsObj.$toString())








        return results

      } else {
        console.error('how ya want me to filter', val, 'ya foo!')
      }

      return val
    }
  })
}

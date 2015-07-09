"use strict";

var forEach = require('lodash/collection/forEach')

var util = require('../../../util')
var Base = require('../../')
var Operator = require('./')
var Results = require('./results')

var makeTest = require('../../../util/test').makeTest

module.exports = new Operator({
  $key: '$filter',
  $operator: function( val, operator, origin ) {
    //cache met EVENT! 
    if(typeof val === 'object') {
        
      console.error('++++++++++++++++ $filter!')

      var results = operator.$getResults(this, void 0, true)

      // TODO: find a good way to handle existing results
      // for now: only apply filter once

      if(results._$filtered) {
        return results
      }
      results._$filtered = true

      // if(results.length) {
      //   results.$reset()
      // }

      var subsObj = new Base()
      // console.log('\n\n====================== make itemTest')
      var itemTest = makeTest(operator, subsObj)
      // console.log('====================== made itemTest\n\n')

      console.log('subsObj:', subsObj.$toString())

      if(util.isPlainObj( val )) {
        forEach( val, forProperties)
      } else {
        val.$each(
          forProperties, 
          function(key) {
            return !operator.$operators[key]
          }
        )
      }

      function forProperties(value, key) {

        console.error('==================== item', key)

        var check = itemTest(value)
        console.log('checks out?', check, 'wex')

        var resultsRef

        if(check) {
          console.log('1 >>>>>>> push it in thur')
          results.$push(value) // TODO: if sorted use $splice
          resultsRef = results[results.length-1]
        }

        // if order matters we need to determine if this filter results is sorted (before filtered) to know if we need to re-sort / splice when items are added

        if(value instanceof Base) {

          value.$subscribe(subsObj, {
            $change: function filterListener() {
              console.error('--------- !! filterListener !!')
              var check = itemTest(value)
              console.log('checks out?', check)
              if(check) {
                if(!resultsRef) { // checks out but not in
                  console.log('checks out but not in')
                  console.log('2 >>>>>>> push it in thur')
                  results.$push(value) // TODO: if sorted use $splice
                  resultsRef = results[results.length-1]
                }
              } else {
                if(resultsRef) { // does not check out but is in
                  console.log('does not check out but is in')
                  // when ready: resultsRef.$remove() in stead of:
                  results.$splice(resultsRef._$key, 1)
                  // keep this:
                  resultsRef = null  
                }
              }

            }
          })

        }
      }

      return results

    } else {
      console.error('how ya want me to filter', val, 'ya foo!')
    }

    return val
  }
}).$Constructor




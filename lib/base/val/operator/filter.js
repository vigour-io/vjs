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
      
      var results = operator.$getResults(this, void 0, true)
      var subsObj = new Base()
      var itemTest = makeTest(operator, subsObj)

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
        var check = itemTest(value)
        console.log('checks out?', check, 'wex')

        var resultsRef

        if(check) {
          results.$push(value) // TODO: if sorted use $splice
          resultsRef = results[results.length-1]
          console.log('wut pushed', results)
        }

        if(value instanceof Base) {

          value.$subscribe(subsObj, {
            $change: function filterListener() {
              var check = itemTest(value)

              if(check) {
                if(!resultsRef) { // checks out but not in
                  results.$push(value) // TODO: if sorted use $splice
                  resultsRef = results[results.length-1]
                }
              } else {
                if(resultsRef) { // does not check out but is in
                  // when ready: resultsRef.$remove() in stead of:
                  results.splice(resultsRef._$key, 1)
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




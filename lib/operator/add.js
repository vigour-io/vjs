"use strict";

var forEach = require('lodash/collection/forEach')
var Base = require('../base')
var Observable = require('../observable')
var List = require('../list')
var Operator = require('./')

var $move = require('./shared/move')

exports.$inject = require('./shared')

exports.$flags = {
  $add: new Operator({
    $key: '$add',
    $operator: function( val, operator, origin ) {

      console.log('++++++++++++++ add!')

      if(typeof val === 'object') {
        operator._result = null

        if(!operator._results) {
          // console.log('make results')

          var results = operator.$makeResults(val, true)
          var operatorVal = operator.$parseValue(val, origin)

          if(results instanceof List) {
            if(typeof operatorVal === 'object') {
              if(operatorVal instanceof Base) {
                operatorVal.each(
                  function(value, key){
                    console.log('pushing', value)
                    results.$push(value)
                  }, 
                  function(key) {
                    return operator.$operators[key]
                  }
                )
              } else {
                forEach(operatorVal, function(value, key ) {
                  results.$setKey(key, value)
                })
              }
            }else{
              results.$push(operatorVal)
            }
          } else {
            if(typeof operatorVal === 'object') {
              if(operatorVal instanceof Base) {
                operatorVal.each(
                  function(value, key){
                    results.$setKey(key, value)
                  }, 
                  function(key) {
                    return operator.$operators[key]
                  }
                )  
              } else {
                forEach(operatorVal, function(value, key ) {
                  results.$setKey(key, value)
                })
              }
            } else {
              results.$setKey('addOnResult', operatorVal)
            }
          }

          // TODO: make sure that results stay up to date!

          if(val instanceof Observable) {
            console.log('LISTEN FOR ADD ON PROPERTY IN', val.$path)



            val.on('$property', [ function(event, delta){
              console.error('--------- !! add Listener ($property) !!', delta)
              
              // results.$applyDelta(delta, null, val, event)

              var handler = results instanceof List
                ? ListPropHandler
                : propHandler

              handler(results, val, delta)
              
            }, operator])

            // val.on('$delta', function(event, delta){
            //   console.log('---------- $delta in add', delta)
            //   // results.$applyDelta(delta)
            //   // results.$emit('$delta', delta)
            // })

          }

        } else {
          console.log('already made results!')
        }

        return operator._results

      } else {
        if(this.$results) {
          console.error('have $results, remove?')
        }
        var stamp = this.$stamp
        var resultStamp = operator._resultStamp
        if(stamp !== resultStamp || !resultStamp) {
          var operatorVal = operator.$parseValue( val, origin )
          operator._result = val + operatorVal
          operator.resultStamp = stamp
        }
        return operator._result
      } 
    }
  })
}


function ListPropHandler(results, val, delta){
  var moved = delta.moved
  var added = delta.added
  var addCache
  if(added) {
    addCache = moved && {}
    console.warn('handle added in add')

    if(results instanceof List) {

      // splice the added fields into my results
      
      var start = added[0]
      var args = [start, 0]

      for(var i = 0, l = added.length ; i < l ; i++) {
        var addindex = added[i]
        if(addCache) {
          addCache[addindex] = true
        }
        args.push(val[added[i]])
        // var movedindex = moved && moved[addindex]

        // args.push( movedindex !== void 0
        //   ? val[movedindex]
        //   : val[addindex]
        // )

      }
      results.$splice.apply(results, args)
    } else {

    }
  }
  var moved = delta.moved
  if(moved) {
    console.warn('handle moved in add', moved)

    for(var to in moved) {
      if(!added || !addCache[to]) {
        results.$setKey(to, val[to], false)
      }
    }
  }

  if(delta.removed) {
    console.warn('handle removed in add')
  }

}
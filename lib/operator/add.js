"use strict";

var forEach = require('lodash/collection/forEach')
var Base = require('../base')
var Observable = require('../observable')
var List = require('../list')
var Operator = require('./')
var set = Operator.prototype.set

var $move = require('./shared/move')

exports.$inject = require('./shared')

exports.$flags = {
  $add: new Operator({
    $define:{
      set:function(val){
        if(val.constructor === Array){
          var length = val.length
          var obj = val[0] instanceof Object ? val[0] : {$val:val[0]}
          var key = this.$key
          var next = obj
          var i = 1
          for (; i < val.length; i++) {
            next = next[key] = val[i] instanceof Object ? val[i] : {$val:val[i]}
          }
          arguments[0] = obj
          set.apply(this, arguments)
        }else{
          set.apply(this, arguments)
        }
      }
    },
    $key: '$add',
    $operator: function( val, operator, origin ) {
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
                  results.setKey(key, value)
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
                    results.setKey(key, value)
                  },
                  function(key) {
                    return operator.$operators[key]
                  }
                )
              } else {
                forEach(operatorVal, function(value, key ) {
                  results.setKey(key, value)
                })
              }
            } else {
              results.setKey('addOnResult', operatorVal)
            }
          }

          if(val instanceof Observable) {
            // add property listener to keep results synced
            var propertyHandler = createPH(results, val)
            val.on('$property', [ propertyHandler, operator], false, function operatorCompare(compare) {
                return compare[1] !== operator
              }
            )
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




function createPH(results, val) {
  return function propertyHandler(event, delta){
    console.error('--------- !! add Listener ($property) !!', delta)

    var handler = results instanceof List
      ? ListPropHandler
      : propHandler

    handler(results, val, delta)

  }
}

function ListPropHandler(results, val, delta){
  var moved = delta.moved
  var added = delta.added
  var addCache
  if(added) {
    addCache = moved && {}
    console.warn('handle added in add')
    // splice the added fields into my results
    var start = added[0]
    var args = [start, 0]

    for(var i = 0, l = added.length ; i < l ; i++) {
      var addindex = added[i]
      if(addCache) {
        addCache[addindex] = true
      }
      args.push(val[added[i]])
    }
    results.$splice.apply(results, args)

  }
  var moved = delta.moved
  if(moved) {
    // console.warn('handle moved in add', moved)
    var $handleShifted = results.$handleShifted
    for(var to in moved) {
      if(!added || !addCache[to]) {
        results.setKey(to, val[to], false)
        if($handleShifted) {
          results.$handleShifted(to)
        }
      }
    }
  }

  if(delta.removed) {
    console.warn('handle removed in add')
  }

}

function propHandler(results, val, delta) {
  throw new Error('oops not yet implemented!')
}

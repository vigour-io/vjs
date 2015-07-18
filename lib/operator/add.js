"use strict";

var forEach = require('lodash/collection/forEach')
var Base = require('../base')
var Observable = require('../observable')
var List = require('../list')
var Operator = require('./')

exports.$inject = require('./shared')

exports.$flags = {
  $add: new Operator({
    $key: '$add',
    $operator: function( val, operator, origin ) {
      if(typeof val === 'object') {
        operator._result = null

        if(!operator._results) {
          // console.log('make results')

          var results = operator.$makeResults(val, true)
          var toAdd = operator.$parseValue( val, origin )

          if(results instanceof List) {
            if(typeof toAdd === 'object') {
              if(toAdd instanceof Base) {
                toAdd.each(
                  function(value, key){
                    results.$push(value)
                  }, 
                  function(key) {
                    return operator.$operators[key]
                  }
                )
              } else {
                forEach(toAdd, function(value, key ) {
                  results.$setKey(key, value)
                })
              }
            }else{
              results.$push(toAdd)
            }
          } else {
            if(typeof toAdd === 'object') {
              if(toAdd instanceof Base) {
                toAdd.each(
                  function(value, key){
                    results.$setKey(key, value)
                  }, 
                  function(key) {
                    return operator.$operators[key]
                  }
                )  
              } else {
                forEach(toAdd, function(value, key ) {
                  results.$setKey(key, value)
                })
              }
            } else {
              results.$setKey('addOnResult', toAdd)
            }
          }

          // TODO: make sure that results stay up to date!

          if(val instanceof Observable) {



            val.on('$operatorChain', function(event, delta){
              console.error('!!!!!!!!!!! omg an operator before me is kicking me!', delta)
              var moved = delta.moved
              if(delta.moved) {
                console.log('things have moved! handle it')
                results.move(moved)
              }
              var removed = delta.removed
              if(removed) {
                console.log('things where deleted! handle it')
              }
              var added = delta.added
              if(delta.added) {
                console.log('things where added! handle it')
              }
              results.$emit('$operatorChain', delta)
            })

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


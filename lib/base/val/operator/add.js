var util = require('../../../util')
var Base = require('../../')
var Operator = require('./')
var Results = require('./results')


module.exports = add = new Operator({
  $key: '$add',
  $operator: function( val, operator, origin ) {
    
    //cache met EVENT!

    if(!this.$results) {
      this.$results = new Results({}, false ,this)
    }

    if(typeof val === 'object') {
      var arr = this.$results
      if(util.isPlainObj(val)) {
        forEach(val, function(field, key ) {
          arr.$setKey( key, field, false )
        })
      } else if(val instanceof Base) {
        val.$each(function(field, key) {
           arr.$setKey( key, field, false ) 
        }, function(field) {
          return !operator._$operators[field]
        })
      }

      val = operator.$parseValue( val, origin )

      if(val === operator) {
        operator.$each(function(field, key) {
          arr.$setKey( key, field )
        })
      } else {
        arr.$setKey( 'addOnResult', val, false )
      }
      return arr
    }

    return val + operator.$parseValue( val, origin )
  }
})
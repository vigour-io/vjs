"use strict";

var parseValue = require('../../base').prototype.$parseValue

exports.$define = {
  $parseValue: function( previousValue, origin ) {
    var val = parseValue.call( this, previousValue, origin )
    var operator = this.$Operator.prototype
    if( operator.$hasOperators( this ) ) {
      var operators = operator.$operators
      for( var key$ in this ) {
        if(operators[key$]) {
          var operator$ = this[key$]
          val = operator$._$operator.call( this, val, operator$, origin )
        }
      }
    }

    return val
  },
  $Operator: require('../'),
  $applyDelta: require('./applydelta')
}
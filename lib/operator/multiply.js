var Operator = require('./')

exports.$inject = require('./shared')

exports.$flags = {
  $multiply: new Operator({
    $key:'$multiply',
    $operator:function( val, operator, origin ) {
      if(typeof val === 'object') {
        console.warn('multiplying an Object (skipped)')
        return val
      } else {
        if(this.$results) {
          console.error('have $results, remove?')
        }
        var stamp = this.$stamp
        var resultStamp = operator._resultStamp
        if(stamp !== resultStamp || !resultStamp) {
          var operatorVal = operator.$parseValue( val, origin )
          operator._result = val * operatorVal
          operator.resultStamp = stamp
        }
        return operator._result
      }
    }
  })
}


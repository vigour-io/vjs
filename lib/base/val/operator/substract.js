var Operator = require('./')

module.exports = new Operator({
  $key:'$substract',
  $operator:function( val, operator, origin ) {
  	if(typeof val === 'object') {
  		console.warn('substracting from an Object (skipped)')
  		return val
  	} else {
  		if(this.$results) {
        console.error('have $results, remove?')
      }
  		var stamp = this.$stamp
      var resultStamp = operator._resultStamp
      if(stamp !== resultStamp || !resultStamp) {
        var operatorVal = operator.$parseValue( val, origin )
        operator._result = val - operatorVal
        operator.resultStamp = stamp
      }
      return operator._result
  	}
  }
}).$Constructor
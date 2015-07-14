var Operator = require('./')

module.exports = new Operator({
  $key:'$substract',
  $operator:function( val, operator, origin ) {

		// check stamp things

  	if(typeof val === 'object') {
  		console.warn('substracting from an Object (skipped)')
  		return val
  	}
  	return val - operator.$parseValue( val, origin )
  }
}).$Constructor
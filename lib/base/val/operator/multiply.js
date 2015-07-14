var Operator = require('./')

module.exports = new Operator({
  $key:'$multiply',
  $operator:function( val, operator, origin ) {

  	// check stamp things

  	if(typeof val === 'object') {
  		console.warn('multiplying an Object (skipped)')
  		return val
  	}
  	return val * operator.$parseValue( val, origin )
  }
}).$Constructor

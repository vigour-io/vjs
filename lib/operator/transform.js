var Operator = require('./')

exports.$flags = {
  $transform: new Operator({
    $key:'$transform',
    $operator:function( val, operator, origin ) {

    	// check stamp things

    	if(val instanceof Object) {
        
      }
      var parsed = operator.$parseValue( val, origin )
      // if(parsed === operator) {
      //   return operator
      // }
      return parsed 
    }
  })
}
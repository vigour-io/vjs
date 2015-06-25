var Operator = require('./')

module.exports = new Operator({
  $key:'$transform',
  $operator:function( val, operator, origin ) {
    var parsed = operator.$parseValue( val, origin )
    // if(parsed === operator) {
    //   return operator
    // }
    return parsed 
  }
}).$Constructor
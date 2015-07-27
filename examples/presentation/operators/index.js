var Observable = require('../../../lib/observable')

Observable.prototype
  .inject( require('../../../lib/operator/transform') )

var a = new Observable({
  $key:'a',
  $val: 1
})

//$parseValue()

//returns this._$val
console.log( a.$val )

var b = new Observable({
  $key: 'b',
  $transform: function( val ) {
    return val + ' ghello!'
  },
  $val: a
})

var c = new Observable({
  $key:'c',
  $val: b,
  d:true
})

// this._$val -- instanceof obs -- return obj.$val
console.log( c.$val, c.$origin, c.d.$parent, c )


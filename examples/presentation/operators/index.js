var Observable = require('../../../lib/observable')

Observable.prototype
  .inject( 
    require('../../../lib/operator/transform'),
    require('../../../lib/operator/add')  
  )

// var Operator = require()

var a = new Observable({
  $key:'a',
  $val: 10
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
  $transform: function( val ) {
    return val.toUpperCase()
  },
  d:true
})

console.log( c.$val )
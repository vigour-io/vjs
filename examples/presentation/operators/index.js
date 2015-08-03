var Observable = require('../../../lib/observable')

Observable.prototype
  .inject( 
    require('../../../lib/operator/transform'),
    require('../../../lib/operator/add'), //rename to append
    require('../../../lib/operator/prepend')    
  )

var Operator = require('../../../lib/operator')

Observable.prototype.$flags = {
  $date: new Operator({
    $key:'$date',
    $operator:function( val, operator, origin ) {

      console.log( operator._$val )

      var parsed = operator.$parseValue( val, origin )
      if( parsed > 0 ) {
        return (new Date(parsed)).toString()
      }
      return parsed 
    }
  })
}

// var Operator = require()

var a = new Observable({
  $key:'a',
  $val: ' this is a '
})

var b = new Observable({
  $key:'b',
  $val: ' this is b '
})

var b2 = new Observable({
  $key:'b2',
  $val: ' STRING: '
})

var c = new Observable({
  $key: 'c',
  $val: a,
  $add: { 
    $prepend: b2,
    $val: b
  },
  $on: {
    $change: function() {
      console.log( this.$val )
    }
  }
})

a.$val = ' this a changed '
b.$val = ' this is b changed '
b2.$val = ' change it b2 : '

var athingWithADate = new Observable({
  $val: Date.now(),
  $date: true //different formats?
})

console.log( athingWithADate.$val )

var objObservable = new Observable({
  a: true,
  b: true,
  c: true,
  $prepend: {
    d: a
  }
})

console.log( objObservable.$val )

var results = objObservable.$val

for(var i in results) {
  console.log(results[i].$origin)
}

// var perf = require('../../../dev/perf')
// var util = require('../../../lib/util')

// var map = Array.prototype.map

// var slice = Array.prototype.slice


// var convert = util.convertToArray

// function keyit(key) {
//     return key
//   }

// // var fn = function() {
// //   var arr = map.call(arguments, keyit )
// // }

// var fn = function() {
//   return slice.call(arguments)
// }


// var utilconvert = function() {
//   return convert( arguments )
// }

// var arrs = []

// perf(function() {
//   for(var i = 0 ; i < 100000000; i++) {
//     arrs = utilconvert( 1, 2, 3, 4, 5 )
//   }
// })
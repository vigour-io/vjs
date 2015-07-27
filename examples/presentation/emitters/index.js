var Observable = require('../../../lib/observable')

var Emitter = require('../../../lib/emitter')

var Base = require('../../../lib/base')

//$ChildConstructor
var ARandomConstructor = new Base({
  hello:true
})
var bla = new Observable({
  $define: {
    $ChildConstructor: ARandomConstructor.$Constructor
  }
})

// Object.defineProperty( bla, '$ChildConstructor', {
//   value: ARandomConstructor.$Constructor,
//   configurable: true
// })
// console.log( bla, Object.getPrototypeOf( bla ) === ARandomConstructor )
var blaInstance = new bla.$Constructor({
  specialField: true
})

console.log(blaInstance)
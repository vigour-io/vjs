var Observable = require('../../lib/observable')

console.clear()

var b = new Observable({
  $on: {
    $change: { $val: [ function () {}, 'xxx' ] }
  }
})

var a = new Observable({
  $key: 'a',
  $on: {
    //shortcut for val!
    $change: { danihhhlo: b }
  }
})

a.$val = 'xxxxxxx'


a.$on.$change.$addListener( function() {


} )

a.$on.$change.$addListener( function() {


}, 'val' )

console.log(a.$on)

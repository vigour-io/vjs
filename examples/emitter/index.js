var Observable = require('../../lib/observable')

console.clear()

var b = new Observable({
  $on: {
    $change: function() {
      console.log('@#@#!@#')
    }
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

console.log(a.$on)

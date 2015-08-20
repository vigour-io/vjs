var Observable = require('../../lib/observable')

console.clear()

var b = new Observable({
  $on: {
    $change: function() {
      console.log('hey hey hey updace!')
    }
  }
})

var a = new Observable({
  $key: 'a',
  $val: b,
  $on: {
    //shortcut for val!
    $change: function() {
      console.log('update here!')
    }
  }
})

b.$val = 'xxxxxxx'

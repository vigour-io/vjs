var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

// =============================================================

var a = new Base('a')
var b = new Base('b')
var c = new Base('c')

var adder = new Base({
  $val: a,
  $add: {
    $val:b,
    $add:c
  }
})

adder.$set({
  $on:{
    $change: function(){
      // this is just here to add laststamp
    }
  }
})



console.log('------ get .$val 1')
var $val = adder.$val
console.log('$val', $val)
console.log('------ get .$val 2 (return cached)')
$val = adder.$val
console.log('$val', $val)


console.log('------ change b')
b.$val = 'lurft'
console.log('------ get .$val 3 (recalculate)')
$val = adder.$val
console.log('$val', $val)

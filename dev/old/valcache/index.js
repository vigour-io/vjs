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



console.log('\n------ get .$val 1')
var $val = adder.$val
console.log('$val', $val)
console.log('\n------ get .$val 2 (return cached)')
$val = adder.$val
console.log('$val', $val)


console.log('\n------ change b')
b.$val = 'lurft'
console.log('\n------ get .$val 3 (recalculate)')
$val = adder.$val
console.log('$val', $val)

// ======================== 

var a = new Base('a')
var b = new Base('b')
var c = new Base('c')
var ref = new Base(c)

var adder2 = new Base({
  $val: a,
  $add: {
    $val:b,
    $add:ref
  }
})

adder2.$set({
  $on:{
    $change: function(){
      // this is just here to add laststamp
    }
  }
})


console.log('\n\n\n------ now with reference')
console.log('------ get .$val 1')
var $val = adder2.$val

console.log('dat val is', $val)
console.log('\n-------- change it!')

c.$val = '--purk!'

$val = adder2.$val
console.log('dat val is', $val)

console.log('\n-------- change add somehwere')
adder2.$add.$add.$val = 'hurk'

$val = adder2.$val
console.log('dat val is', $val)


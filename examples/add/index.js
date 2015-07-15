var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

// =============================================================

var base = new Base({
  field: 'field',
  $add:{
    addedfield: 'addedfield'
  }
})


console.log('\n--------- get val 1')
var $val = base.$val

console.log('$val:', $val)

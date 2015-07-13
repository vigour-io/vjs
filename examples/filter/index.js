var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

var List = require('../../lib/list')

// =============================================================

function logList(base) {
  console.log('--------------', base.$path)
  base.$each(function(value, key) {
    value = value.$origin
    var str = '> '
    value.$each(function(b, k){
      var val = b.$val
      if(val instanceof Object) {
        str += k + ': ' + printObj(val) + ' '
      } else {
        str += k + ': ' + val + ' '
      }
      
    })
    console.log(str)
  })
}

function printObj(base, spaces) {
  if(!spaces) spaces = 0
  var str = '{ '
  var indent = makeIndent(spaces)
  base.$each(function(prop, key){
    str += indent + key + ':'
    var val = prop.$val
    if(typeof val === 'object') {
      str += printObj(val, spaces + 2)
    } else {
      str += val
    }
  })
  return str + ' }'
}

function makeIndent(spaces) {
  var result = ''
  while(spaces) {
    result += ' '
    spaces--
  }
  return result
}

// =============================================================


console.log('\n\n\n\n---------- filterings')


console.log('\n\n=============================== filter 1')

var refNest = new Base({
  nk: 4
})

var items = [
  { id: 0, name: 'burk', nest: {nk: 0}}, 
  { id: 1, name: 'bur', nest: {nk: 1} },
  { id: 2, name: 'frep', nest: {nk: 2} },
  { id: 3, name: 'sneaky', nest: {nk: 3} },
  { id: 4, name: 'REF G', nest: refNest }
]

items.$filter = {
  nest: {
    nk: { $gte: 2}
  }
}

// items.$sort = {
//   by: 'age'
// }

var base = window.b = new Base(items)
base._$key = 'base'

console.log('\n\n=============================== calculate value!')

var $val = base.$val

console.log('\n\n=============================== things now look like:')
logList(base)
logList($val)



console.log('\n\n=============================== 1 --> normal value change')

base[2].nest.nk.$val = 1
logList($val)


console.log('\n\n=============================== 1 --> reffed value change')
refNest.nk.$val = 1
logList($val)

console.log('\n\n=============================== 1 --> ref to normal value')
base[4].nest.$val = {nk: 100}
logList($val)
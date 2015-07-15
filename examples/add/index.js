var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

// =============================================================


var setobj = [
  {id: 0, name: 'durk', age: 12},
  {id: 1, name: 'ddurk', age: 122},
  {id: 2, name: 'larf', age: 102},
  {id: 3, name: 'smark', age: 1},
]
setobj.$sort = 'age'
setobj.$add = [{id:4, name:'ADDED', age: 103}]


var base = new Base(setobj)
base._$key = 'base'

console.log('\n--------- get val 1')
var $val = window.$val = base.$val

console.log('$val:', raw($val))

console.log('\n--------- now change something sorted!')
base[0].age.$val = 150
console.log('base.$sort._results:', raw(base.$sort._results))
console.log('$val:', raw($val))





function raw(base) {
  base = base.$origin
  var result
  base.$each(function(value, key){
    if(!result) {
      result = {}
      if(base._$val !== undefined) {
        result.$val = base._$val
      }
    }
    result[key] = raw(value)
  })
  if(!result) {
    result = base._$val
  }
  return result
}
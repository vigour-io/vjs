var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')


var define = Object.defineProperty

//-------------------------------------------------------------



var list = new Base()

define(list, '$$unshift', {
  value: Array.prototype.unshift
})

define(list, '$$push', {
  value: Array.prototype.push
})

define(list, '$$splice', {
  value: Array.prototype.splice
})

define(list, '$$ArraySort', {
  value: Array.prototype.sort
})

define(list, 'length', {
  value: 0,
  enumerable: false,
  writable: true
})

list.$$unshift('shine')

window.list = list

list.$$unshift('durk', 'smurk', 'sjeisk')

list.$$splice(2,0,'GESPLICED')

console.log('-------------- list:')
list.$each(function(val, key){
  console.log(key, ':', val)
})
console.log('--------------')

list.$$ArraySort()

console.log('-------------- list:')
list.$each(function(val, key){
  console.log(key, ':', val)
})
console.log('--------------')
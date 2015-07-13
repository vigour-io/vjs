
console.log('\n\n=============================== filter 1')

var items = [
  { name: 'burk', age: 100 }, 
  { name: 'bur', age: 15 },
  { name: 'brep', age: 150 }
]

items.$filter = {
  name: {$contains: 'bur'}
}
items.$sort = {
  by: 'age'
}

var base = new Base(items)

var $val = base.$val

console.log('-------------- base:')
base.$each(function(value, key){
  console.log('>', key, 'name', value.$origin.name.$val)
})

console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, 'name', value.$origin.name.$val)
})

var changing = base[0].name
console.log('\n \n=============================== changing', changing.$val)
changing.$val = 'shushu'
console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, 'name', value.$origin.name.$val)
})


changing = base[2].name
console.log('\n \n=============================== changing', changing.$val)
changing.$val = 'burburbur'
console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, 'name', value.$origin.name.$val)
})









console.log('\n\n\n\n---------- filterings')


console.log('\n\n=============================== filter 1')

var items = [
  { id: 1, name: 'burk', age: 100, fursh: 'kurbur' }, 
  { id: 2, name: 'bur', age: 15, smur: 'lurp' },
  { id: 3, name: 'frep', age: 150, berk: 'le' }
]

items.$filter = {
  $: {$contains: 'bur'}
}
// items.$sort = {
//   by: 'age'
// }

var base = new Base(items)

var $val = base.$val

console.log('-------------- base:')
base.$each(function(value, key){
  value = value.$origin
  var str = '> '
  value.$each(function(b, k){
    str += k + ': ' + b.$val + ' '
  })
  console.log(str)
})

console.log('-------------- $val:')
$val.$each(function(value, key){
  value = value.$origin
  var str = '> '
  value.$each(function(b, k){
    str += k + ': ' + b.$val + ' '
  })
  console.log(str)
})

var changing = base[1].name
console.log('\n \n=============================== changing 1', changing.$val)
changing.$val = 'shushu'
console.log('-------------- $val:')
$val.$each(function(value, key){
  value = value.$origin
  var str = '> '
  value.$each(function(b, k){
    str += k + ': ' + b.$val + ' '
  })
  console.log(str)
})


changing = base[2].name
console.log('\n \n=============================== changing 2', changing.$val)
changing.$val = 'burburbur'
console.log('-------------- $val:')
$val.$each(function(value, key){
  value = value.$origin
  var str = '> '
  value.$each(function(b, k){
    str += k + ': ' + b.$val + ' '
  })
  console.log(str)
})

changing = base[2]
console.log('\n \n=============================== adding field to', changing)

changing.$set({
  lolwat: 'bur'
})


console.log('-------------- $val:')
$val.$each(function(value, key){
  value = value.$origin
  var str = '> '
  value.$each(function(b, k){
    str += k + ': ' + b.$val + ' '
  })
  console.log(str)
})









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
      str += k + ': ' + b.$val + ' '
    })
    console.log(str)
  })
}

// =============================================================


console.log('\n\n\n\n---------- filterings')


console.log('\n\n=============================== filter 1')

var reffedLurp = new Base('lurp')

var items = [
  { id: 1, name: 'burk', age: 100, fursh: 'kurbur' }, 
  { id: 2, name: 'bur', age: 15, smur: 'lurp' },
  { id: 3, name: 'frep', age: 150, berk: 'le' },
  { id: 4, name: 'sneaky', age: 550, smur: reffedLurp }
]

items.$filter = {
  smur: 'lurp'
}

// items.$sort = {
//   by: 'age'
// }

var base = new Base(items)
base._$key = 'base'

console.log('\n\n=============================== calculate value!')

var $val = base.$val

console.log('\n\n=============================== things now look like:')
logList(base)
logList($val)


var change = base[0]
console.log('\n\n=============================== 1 set smur to bur')

change.$set({
  smur: 'bur'
})
logList($val)

console.log('\n\n=============================== 2 set smur to lurp')
change.$set({
  smur: 'lurp'
})
logList($val)




































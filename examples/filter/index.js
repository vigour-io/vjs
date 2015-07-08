var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

var List = require('../../lib/list')

// =============================================================

console.log('\n\n\n\n---------- filterings')


console.log('\n\n===============================')

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
  console.log('>', key, value.$origin.$toString())
})

console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, value.$origin.$toString())
})

console.log('\n\n=============================== changing', base[0].name.$val)

base[0].name.$val = 'durk'

console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, value.$origin.$toString())
})



throw new Error('wait')

// =============================================================

var n = 150
var loop = 500

var durk = new List()

perf({
  log: console.log.bind(console),
  name: 'sort self',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      var list = new List()
      list._$key = 'list'
      list.$push('A', 'a', 'za', 'fr23', 'ZA', 'a')
      list.$sort()
    }
  },
  loop: loop
})


list2 = new List()

perf({
  log: console.log.bind(console),
  name: 'sort key',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      list2 = new List()
      list2._$key = 'list'
      list2.$push({name:'sjaak'}, {name: 'adrie'}, {name: 'fred'}, {name: 'joosje'})
      list2.$sort({by: 'name'})
    }
  },
  loop: loop
})

console.log('wurk?', list2.$toString())

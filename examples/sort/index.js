var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

var List = require('../../lib/list')

// =============================================================

console.log('\n\n\n\n---------- prepending')


console.log('\n\n=============================== sort by self')

var items = ['A', 'a', 'za', 'fr23', 'ZA', 'a']
items.$sort = true

var base = new Base(items)
base._$key = 'base'

var $val = base.$val

console.log('-------------- base:')
base.$each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, value.$origin.$val)
})


console.log('\n\n=============================== sort by key')

var items = [{title: 'swanky'}, {title: 'durp'},{title: 'flaps'},{hurp: 'durp'}, {title: false},{title: 'A'},{title: 'z'},{title: 'a'},{title: 'Z'} ]
items.$sort = {by: 'title'}
items.$prepend = [{title: 'prepended mafakka'}]

var base = new Base(items)
base._$key = 'base'

var $val = base.$val

console.log('-------------- base:')
base.$each(function(value, key){
  console.log('>', key, value.$origin.title && value.$origin.title.$val)
})

console.log('-------------- $val:')
$val.$each(function(value, key){
  console.log('>', key, value.$origin.title && value.$origin.title.$val)
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

var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')
var Event = require('../../lib/base/on/event')
var Krek = require('./krek')

var List = require('../../lib/list')

//-------------------------------------------------------------

var $getPropertyValue = require('../../lib/base/set').$getPropertyValue
var $handleShifted = require('../../lib/list/handleshifted')

//-------------------------------------------------------------

console.log('\n\n\n\n---------- list')

var list = List.prototype



// =============================================================


throw 1


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

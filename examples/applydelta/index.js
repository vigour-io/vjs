var perf = require('../../dev/perf')

var define = Object.defineProperty


var Observable = require('../../lib/observable')
Observable.prototype.inject( 
  require('../../lib/operator/add'),
  require('../../lib/operator/prepend'),
  require('../../lib/operator/filter'),
  require('../../lib/operator/map'),
  require('../../lib/operator/multiply'),
  require('../../lib/operator/sort')
)

var List = require('../../lib/list')

// =============================================================

function raw(base) {
  base = base.$origin
  var result
  base.each(function(value, key){
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

window.raw = raw

console.log('\n\n=============================== applyDelta perf test')

var a = new List()
a.$push(0,1,2,3,4,5)


var b = new List()
b.$push(0,1,2,3,4,5)

var n = 10000

perf({
  log: console.log.bind(console),
  name: 'context stuff tester',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      a.$applyDelta({moved: {'0': 1, '1': 2, '2': 3, '3': 1}})
    }
  },
  loop: 120
})

console.log('\n\n============================ SWITCH \n\n')

window.perf = true

perf({
  log: console.log.bind(console),
  name: 'context stuff tester',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      b.$applyDelta({moved: {'0': 1, '1': 2, '2': 3, '3': 1}})
    }
  },
  loop: 120
})
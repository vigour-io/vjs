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

var Event = require('../../lib/event')

Event.prototype.inject(require('../../lib/event/toString'))

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



console.log('\n\n=============================== primitive items')

console.log('\n\n\n\n---------- filter > sort > add!')

var items = ['A', 'a', 'za', 'fr23', 'ZA', 'a']
items.$filter = { $contains: 'za' }
items.$sort = true
items.$add = ['ADDED', 'flap']

var obs = new Observable(items)
obs.$key = 'obs'

console.log('\n\n\n=========== getting $val!')
var $val = window.val = obs.$val

console.log('-------------- obs:')
obs.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})


console.clear()
console.log('\n\n\n++++++++++++++ set obs[0] to GOAN CHANGED:')
obs[0].$val = 'GOAN CHANGED za'

console.log('-------------- obs.$filter._results:')
obs.$filter._results.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})
console.log('-------------- obs.$sort._results:')
obs.$sort._results.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.clear()


// var observable = Observable.prototype
// var _$emit = observable.$emit

// observable.define({
//   $emit: function(type, event, meta) {
//     console.log('emitting!',type, this.$path, arguments, event && event.$origin === this, event && event.$origin.$path)
//     console.log(event.toString())
//     _$emit.apply(this, arguments)

//   }
// })



console.log('\n\n\n++++++++++++++ set za to blerkje:')
obs[2].$val = 'blerkje'
console.log('-------------- obs.$filter._results:')
obs.$filter._results.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})
console.log('-------------- obs.$sort._results:')
obs.$sort._results.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})
console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})



throw new Error('wait')






















console.clear()
console.log('\n\n=============================== sort by self with add')

var items = ['A', 'a', 'za', 'fr23', 'ZA', 'a']
items.$sort = true
items.$add = ['11111111']

var obs = new Observable(items)
obs.$key = 'obs'

var $val = obs.$val

console.log('-------------- obs:')
obs.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('++++++++++++++ change some:')
obs[0].$val = 'GOAN CHANGED za'

console.log('-------------- obs.$sort._result:')
obs.$sort._results.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

throw new Error('wait')

console.clear()

console.log('\n\n=============================== sort by self with prepend')


var items = ['A', 'a', 'za', 'fr23', 'ZA', 'a']
items.$sort = true
items.$prepend = ['11111111']

var obs = new Observable(items)
obs.$key = 'obs'

var $val = obs.$val

console.log('-------------- obs:')
obs.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('++++++++++++++ change some:')
obs[0].$val = 'GOAN CHANGED'

console.log('-------------- obs.$sort._result:')
obs.$sort._results.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})







throw new Error('wait')


console.log('\n\n=============================== sort by key')

var items = [{title: 'swanky'}, {title: 'durp'},{title: 'flaps'},{hurp: 'durp'}, {title: false},{title: 'A'},{title: 'z'},{title: 'a'},{title: 'Z'} ]
items.$sort = {by: 'title'}
items.$prepend = [{title: 'prepended mafakka'}]

var obs = new Observable(items)
obs.$key = 'obs'

var $val = obs.$val

console.log('-------------- obs:')
obs.each(function(value, key){
  console.log('>', key, value.$origin.title && value.$origin.title.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.title && value.$origin.title.$val)
})



var define = Object.defineProperty

var Observable = require('../../lib/observable')
Observable.prototype.inject( 
  require('../../lib/operator/add'),
  require('../../lib/operator/filter'),
  require('../../lib/operator/map'),
  require('../../lib/operator/multiply'),
  require('../../lib/operator/sort')
)

var List = require('../../lib/list')

// =============================================================

console.log('\n\n\n\n---------- sorting!')


console.log('\n\n=============================== sort by self')

var items = ['A', 'a', 'za', 'fr23', 'ZA', 'a']
items.$sort = true

var obs = new Observable(items)
obs._$key = 'obs'

var $val = obs.$val

console.log('-------------- obs:')
obs.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})


console.log('\n\n=============================== sort by key')

var items = [{title: 'swanky'}, {title: 'durp'},{title: 'flaps'},{hurp: 'durp'}, {title: false},{title: 'A'},{title: 'z'},{title: 'a'},{title: 'Z'} ]
items.$sort = {by: 'title'}
items.$prepend = [{title: 'prepended mafakka'}]

var obs = new Observable(items)
obs._$key = 'obs'

var $val = obs.$val

console.log('-------------- obs:')
obs.each(function(value, key){
  console.log('>', key, value.$origin.title && value.$origin.title.$val)
})

console.log('-------------- $val:')
$val.each(function(value, key){
  console.log('>', key, value.$origin.title && value.$origin.title.$val)
})

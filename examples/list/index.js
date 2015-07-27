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

console.log('\n\n=============================== list shizle')

var l = window.list = new List()
l.$push(0,1,2,3,4,5)
l.on('$property', function(event, delta){
  console.error('property listener fires', delta)
})

console.log('length', l.length)

console.log('\n\n=============================== splice dat buy')
l.$splice(2,4,'HANEW', 'jeejnewi', 'ha1', 'ha12', 'ha2')
console.log('?E?E?E listenin', l)
console.log('', l.length, l)

console.clear()

l.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})
console.log('\n++++++++++ splice')

l.$splice(1, 0, 'SPLICED')

l.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})

console.log('\n++++++++++ sort')

console.log(l.sort(true) )

l.each(function(value, key){
  console.log('>', key, value.$origin.$val)
})
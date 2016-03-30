var data = require('../../data/selection').extend(require('../../data'))
  , test = require('../../util/test')

var list = new data(
  { purk: {test:true}
  , shurk: {test:false}
  , hurd: {test:true}
  }
)

var sel = new data(list, {condition:{test:true}})

list.addListener(function(val, stamp, from, removed, added){
  console.log('\n')
  console.log(val)
  console.log(stamp)
  console.log(from ? from.raw : from)
  console.log(removed)
  console.log(added)
  console.log('\n')
})

// console.log('sel\n', sel.raw)

// list.set('furn', {test:true, burk:'wex'})

// console.log('sel\n', sel.raw)

// list.set('burk',new data({test:true, flag:'shurkje'}), true)

// console.log('sel\n', sel.raw)

sel.remove()

console.log('list:\n', list.raw)
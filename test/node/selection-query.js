var Data = require('../../data')
  , selection = require('../../data/selection')
  , test = require('../../util/test')

var list = new Data({purk:{test:true}, shurk:{test:false}})

var sel = new Data(list,{condition:{ name: 'lurf', roomtype: 'test' }})

sel.addListener(function(val, stamp, from, removed, added){
  console.log('\n!! something changed in sel!')
  if(removed) console.log('REMOVED:', removed.raw ? removed.raw : removed)
  if(added) console.log('ADDED:', added.raw? added.raw : added)
  console.log('\n')
})

logsel()

var created = new Data({})

created.val = { name: 'lurf', roomtype: 'test' , hey:'ho'}

list.set('furn', created, true)

logsel()

function logsel(){
  console.log('------------------ sel\n', sel.raw, '\n------------------\n')
}
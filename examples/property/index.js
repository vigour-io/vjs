var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

log('test property event type')
log('catch stamp!')
console.log('\n\n\n\nCATCH IT')

var a = new Base({
  $key:'a',
  bla:true,
  $on: {
    $new:function(event) {
      log('hello! NEW')
    },
    $change:function(event) {
      log('hello change', event)
    },
    $property: function(event, meta) {
      //may need to add extra property info!
      log('hello property update!', JSON.stringify(meta))
    }
  },
  blax:true
})

log('\n\n\n\if fired fail!')

// console.clear()
log('once-----')

a.$set({
  b:1
})

log('twice')

a.$set({
  b:1,
  c:2,
  d:3,
  g:5
})

log('newxxxx')

var b = new a.$Constructor()
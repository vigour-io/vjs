var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

log('test property event type')
log('catch stamp!')
console.log('\n\n\n\nCATCH IT')

var burk = new Base()

var a = new burk.$Constructor({
  $key:'a',
  bla:true,
  $on: {
    // $change:function(event) {
      // log('hello change', event)
    // },
    $property: function(event, meta) {
      //may need to add extra property info!
      log('hello property update!', JSON.stringify(meta))
    },
    $new:function(event) {
      log('NEW hello! NEW', event )
    }
  },
  blax:true
}) //false


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

var b = new a.$Constructor({
  $key:'b',
  ggg:true
})

log('newxxxx2')

var c = new b.$Constructor({
  $key:'c',
  ggg:true,
  gurk:true,
  myblurf:true,
  murko:true
})

// a.$emit('$change')

//now lets work on instances!
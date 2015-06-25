var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

log('test property event type')
log('catch stamp!')
console.log('\n\n\n\nCATCH IT')

var burk = new Base({})

var a = new Base({
  $key:'a',
  bla:true,
  $on: {
    $new:function(event) {
      console.log('new go go1', this.$path)
      log('hello! NEW')
    },
    $change:function(event) {
      console.log('change go go2', event.$stamp, event.$val)
      log('hello change', event)
    },
    $property: function(event, meta) {
      console.log('property go go3', meta)

      //may need to add extra property info!
      log('hello property update!', JSON.stringify(meta))
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

// a.$emit('$change')

//now lets work on instances!
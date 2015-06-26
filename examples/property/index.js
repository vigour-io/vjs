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
    $change:function(event) {
      log('a hello change', this.$path)
    },
    $property: function(event, meta) {
      //may need to add extra property info!
      log('hello property update!', this.$path, JSON.stringify(meta))
    },
    $new:function(event) {
      log('NEW hello! NEW', event )
    }
  },
  blax:true
}) //false


log('\n\n\n\if fired fail!')

// console.clear()
log('once----- a')

a.$set({
  $gg:true,
  b:1
})

// log('twice')

// a.$set({
//   b:1,
//   c:2,
//   d:3,
//   g:5
// })

log('new b log property -b')

var b = new a.$Constructor({
  $key:'b',
  ggg:true,
  $on: {
    //what goes wrong? listeners are completely overwriten
    //change will nog fire a anymore
    $change:function(event) {
      log('b hello change', this.$path)
    },
    $property:function(event, meta) {
      log('hey property but only on b and inheritance of b', this.$path, JSON.stringify(meta), event)
    }
  }
})

log('property update on b')

b.$set({
  blurx:'x'
})

log('fire both --')

a.$set({
  blury:'y'
})

log('only a is wrong / or perhaps use instances ?')


log('new instance of b')

var flurps = new b.$Constructor({
  $key:'flurps',
  flurps:true
})

log('should also fire on a listener (inherit?)')

// log('newxxxx2')

// var c = new b.$Constructor({
//   $key:'c',
//   ggg:true,
//   gurk:true,
//   myblurf:true,
//   murko:true
// })

// a.$emit('$change')

//now lets work on instances!
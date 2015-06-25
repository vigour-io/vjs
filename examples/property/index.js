var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

log('test property event type')

var a = new Base({
  $key:'a',
  bla:true,
  $on: {
    $change:function(event) {
      log('hello change')
    },
    $property: function(event, meta) {
      //may need to add extra property info!
      log('hello property update!', JSON.stringify(meta))
    }
  }
})

a.$set({
  b:1
})


a.$set({
  b:1,
  c:2,
  d:3,
  g:5
})
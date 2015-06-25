var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

log('test property event type')

var a = new Base({
  $key:'a',
  bla:true,
  $on: {
    $change:function(e) {

    },
    $property: function(e) {
      //may need to add extra property info!
      log('hello property update!')
    }
  }
})

a.$set({
  b:1
})
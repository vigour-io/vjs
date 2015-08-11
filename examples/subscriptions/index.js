var define = Object.defineProperty

var Observable = require('../../lib/observable')

var MetaEmitter = require('../../lib/observable/subscriptions/emitter')

var subsEmitter = new MetaEmitter({
  hopla: function(event, meta) {
    console.error('SUBSEMITTER HANDLER FIRED!', meta)
  },
  $pattern: {
    key1: true
  }
})

var ding1 = new Observable({
  key1: 'val1',
  $on: {
    durps: subsEmitter,
    $change: function(event) {
      console.error('----------> change is fired lol')
      if(!subsEmitter._$meta) {
        subsEmitter._$meta = {}
      }
      subsEmitter._$meta.changert = true
      subsEmitter.$emit(event, ding1)
    },
    $property: function(event) {
      console.error('----------> property is fired lol')
      if(!subsEmitter._$meta) {
        subsEmitter._$meta = {}
      }
      subsEmitter._$meta.pruperty = true
      subsEmitter.$emit(event, ding1)
    }
  }
})
ding1.$key = 'ding1'

console.log('\n\n-------------- go fire dat boy')

ding1.$set({
  ha: true
})

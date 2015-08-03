
var Observable = require('../../../lib/observable')
Observable.prototype
  .inject( require('../../../lib/methods/toString') )

var Emitter = require('../../../lib/emitter')

var Event = require('../../../lib/event')
Event.prototype
  .inject( require('../../../lib/event/toString' ))

var b = new Observable({
  $key:'b'
})

var specialEmitter = new Emitter({
  $define: {
    $executePostponed:false
    //$noinstances is broken
  }
})

var a = new Observable({
  $key:'a',
  $on: {
    $change:function( event, meta ) {
      console.log( event, meta, this.$path, event.toString())
      this.$emit( 'specialEmitter', event )
    },
    $flags: {
      specialEmitter: specialEmitter
    }
  },
  $val: b
  // $flags:
})


console.log('creating a new a')

var c = new a.$Constructor({
  $key: 'c',
  $on: {
    specialEmitter: function(event) {
      console.log( 'emitting special!\n', this.$path, event.toString())
    }
  }
})

console.log('setting b')

b.$val = {
  $val:'xx',
  one:1,
  two:2
}

console.log('--------')

// a.$val = 'hello!'

var d = new c.$Constructor({
  $key:'d'
})

c.$val = 'xxxx'

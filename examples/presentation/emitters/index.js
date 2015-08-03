var Observable = require('../../../lib/observable')
var Emitter = require('../../../lib/emitter')

var Event = require('../../../lib/event')

var emit = Emitter.prototype.$emit

var blurfEmitter = new Emitter({
  $define: {
    $emit: function( event, bind, context ) {

      // console.log('hey an emit in blurfEmitter', arguments)
      // var metaObj = arguments

      return emit.call(this, event, bind, context, arguments )
    }
  }
})

var a = new Observable({
  $define: {
    $val: {
      set: function( val ) {
        var event = new Event( this )
        console.log('???')
        this.$emit( '$blurfEmitter', event, val, 'x', 'y', 'z' )
        this.set( val )
      }
    }
  },
  $on: {
    $flags: {
      $blurfEmitter : blurfEmitter
    }
  }
})

var b = new a.$Constructor({
  $on: {
    $blurfEmitter: {
      bbb: function() {
        console.log( arguments )
      }
    }
  }
})

b.$val = 'xxxx'

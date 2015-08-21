var Emitter = require('../../../lib/emitter')
var Event = require('../../../lib/event')

describe('emitter', function() {
  console.clear()
  var a = new Emitter()
  console.log(a)

  a.on(function( event, type ){
    console.log( 'heyheyhey', type )
  })

  //first arg string make that conditional for type?

  //remove dolarsign from emit
  a.emit( 'hello' )

})

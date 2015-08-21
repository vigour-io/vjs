var Emitter = require('../../../lib/emitter')
var Event = require('../../../lib/event')

describe( 'emitter', function() {
  console.clear()

  describe( 'add listener and fire once', function() {
    var a = new Emitter()
    var cnt = 0
    a.on(function( event, type ){
      cnt++
    })
    a.emit()
    it('should have fired once',function() {
      expect( cnt ).to.equal(1)
    })
  })

  describe( 'add and remove listener', function() {
    var a = new Emitter()
    function listener( event, type ) {}
    a.on( listener )
    a.off( listener )
    it('should not have $fn field',function() {
      expect( a.$fn ).to.be.not.ok
    })
  })

})

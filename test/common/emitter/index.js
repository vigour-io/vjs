var Emitter = require('../../../lib/emitter')
var Event = require('../../../lib/event')

describe('emitter', function() {
  console.clear()

  describe('add listener and fire once', function() {
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

})

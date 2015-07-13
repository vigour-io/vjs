var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

var Base = require('../../lib/base')

describe('on', function () {
  
    var base = new Base()
    var base2 = new Base()
    var fired = 0

    it('sets $change, should not fire', function() {
        base.$set({
          $on:{
            $change:function(event) {
              fired++
            }
          }
        })
        expect( fired ).to.equal(0)
    })

    it('fires $change once', function() {
      base.$set({ customField:true })
      expect( fired ).to.equal(1)
    })

    it('listen on base', function() {
      base2.$set({
        referenceToBase: base
      })
      expect( fired ).to.equal(1)
    })

})
var test = require('../')
var describe = test.describe
var it = test.it
var expect = test.expect

describe('Flags', function() {
  var Base
  it('require Base', function () {
    Base = require('../../lib/base')
  })

  var slaps = 0
  var first
  var second
  var lastOrigin

  it('make first instance with flag "poodle"', function(){
    first = new Base({
      $flags:{
        poodle: function(val, e) {
          expect(val).to.equal(slaps)
          lastOrigin = e.$origin
        }
      },
      poodle: slaps
    })
    expect(lastOrigin).to.equal(undefined) // is this correct?
  })

  it('set poodle on first', function(){
    slaps++
    first.$set({
      poodle: slaps
    })
    expect(lastOrigin).to.equal(first)
  })
  
  it('make second and set poodle', function(){
    slaps++
    second = new first.$Constructor({
      poodle: slaps
    })
    expect(lastOrigin).to.equal(second)
  })

  it('separate set on second.poodle', function(){
    slaps++
    second.$set({
      poodle: slaps
    })
    expect(lastOrigin).to.equal(second)
  })

  it('add second.doge flag and set second.doge', function(){
    
    second.$flags = {
      doge: function(val, e) {
        expect(e.$origin).to.equal(second)
        expect(val).to.equal(10)
      }
    }

    second.$set({
      doge: 10
    })

  })  

})

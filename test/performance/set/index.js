var Obs = require('../../../lib/observable')
var util = require('../../../lib/util')
var Event = require('../../../lib/event')

console.clear()

describe( 'set method', function() {
  var amount = 100e3
  it( 'nested fields - using set against baseline', function( done ) {
    this.timeout(50e3)
    console.log('hello?')

    expect(function() {
      console.log('hello?')
      var arr = []
      var Obs2 = new Obs().$Constructor
      for( var i = 0; i < amount; i++ ) {
        arr.push( new Obs2({ i: i }) )
      }
    }).performance({
      // loop: 100,
      margin: 4,
      method: function() {
        console.log('hello?')

        var Obs2 = new Obs().$Constructor
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          var obs = new Obs2()
          obs.i = new Obs2(i)
          obs.i._$key = 'i'
          obs.i._$parent = obs
          arr.push( obs )
        }
      }
    }, done )
  })

  it( 'using set against using set, with key in prototype', function( done ) {
    this.timeout(500e3)
    var Obs2 = new Obs().$Constructor
    var ObsWithI = new Obs({
      i:false
    }).$Constructor

    expect( function() {
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          arr.push( new ObsWithI({ i: i }) )
        }
      }).performance({
      // loop: 10,
      margin:1,
      method: function() {
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          arr.push( new Obs2({ i: i }) )
        }
      }
    }, done )
  })

})

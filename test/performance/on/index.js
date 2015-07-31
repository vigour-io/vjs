console.clear()

var Obs = require('../../../lib/observable')
var util = require('../../../lib/util')
var Event = require('../../../lib/event')

describe( 'set method', function() {

  var amount = 10e3

  it( 'nested fields - using set against baseline', function( done ) {
    this.timeout(50000)

    expect(function() {
      var arr = []
      var Obs2 = new Obs().$Constructor
      for( var i = 0; i < amount; i++ ) {
        arr.push( new Obs2({ i: i }) )
      }
    }).performance({
      loop: 100,
      margin: 2.5,
      method: function() {
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
    this.timeout(50000)
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
      loop: 100,
      margin:2,
      method: function() {
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          arr.push( new Obs2({ i: i }) )
        }
      }
    }, done )
  })

})

describe( 'on change emitters', function() {

  console.log('on change emitters')

  var measure = 0
  var amount = 1e3
  var instances = []

  it( 'on multiple instances', function( done ) {
    var amount = 1e3
    this.timeout(5000)
    expect(function() {
      var a = new Obs({
        $key:'a',
        $on: {
          $change:function() {
            measure++
          }
        }
      })
      var arr = instances
      var event = new Event( a )
      for( var i = 0; i < amount; i++ ) {
        arr.push( new a.$Constructor( { i: i }, event ) )
      }
      a.$emit( '$change', event )
      // expect(measure).to.equal(amount+1)
    }).performance({
      loop: 100,
      margin:2,
      method: function() {
        var b = new Obs({
          $key:'b'
        })
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          arr.push( new b.$Constructor({ i: i }) )
        }
      }
    }, done)
  })

  // it( 'update a', function( done ) {
  //   expect(function() {
  //     a.$val = 'x'
  //   }).performance({
  //     margin: 80,
  //     method: function() {
  //       var cnt = 0
  //       var fn = function(i) {
  //         cnt++
  //         return { i: cnt }
  //       }
  //       var arr = []
  //       for( var i = 0; i < amount; i++ ) {
  //         arr.push(fn(i))
  //       }
  //       console.log( arr.length )
  //     }
  //   }, function() {
  //     expect(measure).to.equal( (amount+1)*2 )
  //     done()
  //   })
  // })

  // it( 'update a instance[0]', function( done ) {
  //   expect(function() {
  //     instances[0].$val = 'y'
  //   }).performance(100, done)
  //   //this is the issue -- instances[0] should not update everything else!!!
  //   // expect(measure).to.equal( (amount+1)*2+1 )
  // })

})

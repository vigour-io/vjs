describe( 'instances set, and change listeners', function() {

  console.clear()
  //this is buggy shit
  var Obs = require('../../../lib/observable')
  var util = require('../../../lib/util')
  var Event = require('../../../lib/event')

  var measure = 0

  var a = new Obs({
    $key:'a',
    $on: {
      $change:function() {
        measure++
        // console.log('xx', this.i.$val)
      }
    }
  })

  var b = new Obs({
    $key:'b',
    // $on: {
    //   $change:function() {
    //     // console.log('xx')
    //   }
    // }
  })

  //a.$val = somthing.media
  var amount = 10e3
  var instances = []

  var Obs2 = new Obs({
    $val:'hello'
  }).$Constructor

  it( 'nested fields', function( done ) {
    this.timeout(5000)
    expect(function() {
      var arr = []
      for( var i = 0; i < amount; i++ ) {
        //optimize!
        arr.push( new Obs2( { i: i } ) )
      }
      console.log(arr[0])
      // expect(measure).to.equal(amount+1)
    }).performance({
      method: function() {
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          var obs = new Obs2()
          obs.i = new Obs(i)
          obs.i._$key = 'i'
          obs.i._$parent = obs
          arr.push(obs)
        }
      },
      margin: 1.1
    }, done )
  })

  it( 'on multiple instances', function( done ) {
    this.timeout(5000)
    expect(function() {
      var arr = instances
      var event = new Event( a )
      for( var i = 0; i < amount; i++ ) {
        arr.push( new a.$Constructor( { i: i }, event ) )
      }
      a.$emit( '$change', event )
      // expect(measure).to.equal(amount+1)
    }).performance({
      method: function() {
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          arr.push( new b.$Constructor({ i: i }) )
        }
      },
      margin: 6
    }, done)
  })

  it( 'update a', function( done ) {
    expect(function() {
      a.$val = 'x'
    }).performance({
      margin: 30,
      method: function() {
        var cnt = 0
        var fn = function(i) {
          cnt++
          return { i: cnt }
        }
        var arr = []
        for( var i = 0; i < amount; i++ ) {
          arr.push(fn(i))
        }
        console.log( arr.length )
      }
    }, function() {
      expect(measure).to.equal( (amount+1)*2 )
      done()
    })
  })

  it( 'update a instance[0]', function( done ) {
    expect(function() {
      instances[0].$val = 'y'
    }).performance(10, done)
    //this is the issue -- instances[0] should not update everything else!!!
    // expect(measure).to.equal( (amount+1)*2+1 )
  })

})

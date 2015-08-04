console.clear()//do this in atom plugin

var Obs = require('../../../lib/observable')
var util = require('../../../lib/util')
var Event = require('../../../lib/event')

describe( 'on change emitters', function() {

  console.log('on change emitters')

  it( 'on multiple instances', function( done ) {
    var amount = 10
    var measure = 0
    this.timeout(5000)
    expect(function() {
      var a = new Obs({
      $key:'a',
        $on: {
          $change:function() {
            measure++
            // console.log('?')
          }
        }
      })
      var arr = []
      var event //= new Event( a, '$change' )
      for( var i = 0; i < amount; i++ ) {
        arr.push( new a.$Constructor({ i: i }, event ) )
      }
      console.log(measure, amount)
      // a.$emit( '$change', event )
      // expect(measure).to.equal(amount+1)
    }).performance({
      // loop: 100,
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

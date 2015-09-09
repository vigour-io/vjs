console.clear()

var Observable = require('../../../../../../lib/observable')

describe( 'instances', function() {

  it( 'should fire for each instance', function(done) {
    var cnt = 0
    var a = new Observable({
      $key:'a',
      $on: {
        $change: {
          $val: function( event ) {
            console.log('exec', this.$path, event.$stamp )
            cnt++
          },
          $defer: function( emit, event, defer ) {
            setTimeout( emit, 200 )
          }
        }
      }
    })
    var b = new a.$Constructor()
    b.$key = 'b'
    var c = new a.$Constructor()
    c.$key = 'c'
    a.$val = 'hello'
    expect( cnt ).to.equal(0)
    setTimeout(function() {
      expect( cnt ).to.equal(3)
      done()
    },300)
  })

  it( 'fire for each using a random timeout', function(done) {
    console.clear()

    var cnt = 0
    var a = new Observable({
      $key:'a',
      $on: {
        $change: {
          $val: function( event ) {
            console.log('exec2', this.$path, event.$stamp )
            cnt++
          },
          $defer: function( emit, event, defer ) {
            setTimeout( emit, Math.random()*200 )
          }
        }
      }
    })
    var b = new a.$Constructor()
    b.$key = 'b'
    var c = new a.$Constructor()
    c.$key = 'c'
    a.$val = 'hello'
    expect( cnt ).to.equal(0)
    setTimeout(function() {
      expect( cnt ).to.equal(3)
      done()
    },300)
  })

})

//the exec thing has to become totally different

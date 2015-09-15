var Observable = require('../../../../../../lib/observable')

console.clear()

describe( 'instances', function() {
  it( 'should fire for each instance', function(done) {
    var cnt = 0
    var a = new Observable({
      $key:'a',
      $on: {
        $change: {
          $val: function( event ) {
            cnt++
          },
          $defer: function( emit, event, defer ) {
            setTimeout( emit, 20 )
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
    },100)
  })
  it( 'fire for each using a random timeout', function(done) {
    var cnt = 0
    var deferCnt = 0
    var a = new Observable({
      $key:'a',
      $on: {
        $change: {
          $val: function( event ) {
            cnt++
          },
          $defer: function( emit, event, defer ) {
            deferCnt++
            setTimeout( emit, Math.random()*20 )
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
      expect( deferCnt ).msg('defers fired').to.equal(3)
      expect( cnt ).to.equal(3)
      done()
    },100)
  })

})

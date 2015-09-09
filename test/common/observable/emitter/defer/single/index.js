var Observable = require('../../../../../../lib/observable')

describe( 'single instance', function() {

  it( 'fire with a timeout of 200ms', function(done) {
    var a = new Observable({
      $on: {
        $change: {
          $val: function() {
            expect(this.$on.$change.$defer.$inProgress).to.be.null
            done()
          },
          $defer: function( emit, event, defer ) {
            setTimeout( emit, 200 )
          }
        }
      }
    })
    a.$val = 'hello'
  })

  it( 'remove defer', function( done ) {
    var cnt = 0
    var a = new Observable({
      $on: {
        $change: {
          $val: function() {
            cnt++
          },
          $defer: {
            $val: function( emit, event, defer ) {
              this._$timeout = setTimeout( emit, 200 )
            },
            cancel: function( event, defer ) {
              clearTimeout( this._$timeout )
            }
          }
        }
      }
    })
    a.$val = 'hello'
    a.remove()
    setTimeout(function() {
      expect(cnt).to.equal(0)
      done()
    }, 300)
  })

  it( 'clear when returning', function() {
    var cnt = 0
    var a = new Observable({
      $on: {
        $change: {
          $val: function() {
            cnt++
          },
          $defer: function( emit, event, defer ) {
            return true
          }
        }
      }
    })
    a.$val = 'hello'
    expect(a.$on.$change.$defer.$inProgress).to.be.null
    expect(cnt).to.equal(0)
  })

  it( 'clear inProgress on cancel', function() {
    var cnt = 0
    var a = new Observable({
      $on: {
        $change: {
          $val: function() {
            cnt++
          },
          $defer: {
            $val: function( emit, event, defer ) {
              defer.cancel()
            }
          }
        }
      }
    })
    a.$val = 'hello'
    expect(a.$on.$change.$defer.$inProgress).to.be.null
    expect(cnt).to.equal(0)
  })

  it( 'reference', function() {
    var cnt = 0
    var b = new Observable()
    var a = new Observable({
      $val: b,
      $on: {
        $change: {
          $val: function() {
            cnt++
          },
          $defer: {
            $val: function( emit, event, defer ) {
              emit()
            }
          }
        }
      }
    })
    b.$val = 'hello'
    expect(cnt).to.equal(1)
  })

})

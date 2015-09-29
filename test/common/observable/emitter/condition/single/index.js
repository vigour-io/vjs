var Observable = require('../../../../../../lib/observable')

describe('single instance', function () {
  /*
    ok so condition will become an observable
    fuck yeah!
    with this we can do the stuff like
    condition: {
      transform
    }
  */
  it('fire with a timeout of 200ms', function (done) {
    var Condition = require('../../../../../../lib/emitter/condition/constructor')

  //   var a = new Observable({
  //     $on: {
  //       $data: {
  //         $val: function () {
  //           expect(this.$on.$change.$condition.$inProgress).to.be.null
  //           done()
  //         },
  //         $condition: {
  //           $transform: function ( emit ) {
  //         
  //             // as val send the obs val
  //             // bind differently??? wtf to do...
  //             // harsh operators asume certain things ofc
  //             // what would mean valid?
  //             // is it ---> true / false
  //             // or are we transforming what were going to send as a payload
  //             // think true false is sort of ok (we are doing the condition of change)
  //             return 'geintje'
  //           }
  //         }
  //       }
  //     }
  //   })

    var a = new Observable({
      $on: {
        $data: {
          $val: function () {
            expect(this.$on.$change.$condition.$inProgress).to.be.null
            done()
          },
          $condition: {
            $transform: function ( val ) {
          
              // as val send the obs val
              // bind differently??? wtf to do...
              // harsh operators asume certain things ofc
              // what would mean valid?
              // is it ---> true / false
              // or are we transforming what were going to send as a payload
              // think true false is sort of ok (we are doing the condition of change)
              return 'geintje'
            }
          }
        }
      }
    })

    a.$val = 'hello'
  })

  it('remove condition', function ( done ) {
    var cnt = 0
    var a = new Observable({
      $on: {
        $data: {
          $val: function () {
            cnt++
          },
          $condition: {
            $val: function ( emit, event, defer ) {
              this._$timeout = setTimeout(emit, 200)
            },
            cancel: function ( event, defer ) {
              clearTimeout(this._$timeout)
            }
          }
        }
      }
    })
    a.$val = 'hello'
    a.remove()
    setTimeout(function () {
      expect(cnt).to.equal(0)
      done()
    }, 300)
  })

  it('clear when returning', function () {
    var cnt = 0
    var a = new Observable({
      $on: {
        $data: {
          $val: function () {
            cnt++
          },
          $condition: function ( emit, event, defer ) {
            return true
          }
        }
      }
    })
    a.$val = 'hello'
    expect(a.$on.$change.$condition.$inProgress).to.be.null
    expect(cnt).to.equal(0)
  })

  it('clear inProgress on cancel', function () {
    var cnt = 0
    var a = new Observable({
      $on: {
        $data: {
          $val: function () {
            cnt++
          },
          $condition: {
            $val: function ( emit, event, defer ) {
              defer.cancel()
            }
          }
        }
      }
    })
    a.$val = 'hello'
    expect(a.$on.$change.$condition.$inProgress).to.be.null
    expect(cnt).to.equal(0)
  })

  it('reference', function () {
    var cnt = 0
    var b = new Observable()
    var a = new Observable({
      $val: b,
      $on: {
        $data: {
          $val: function () {
            cnt++
          },
          $defer: {
            $val: function ( emit, event, defer ) {
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

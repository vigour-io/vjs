var Observable = require('../../../../../../lib/observable')

describe('instances', function () {
  it('should fire for each instance', function (done) {
    var cnt = 0
    var a = new Observable({
      $key: 'a',
      $on: {
        $data: {
          $val: function ( event ) {
            cnt++
          },
          $condition: function ( emit, event, defer ) {
            setTimeout(emit, 20)
          }
        }
      }
    })
    var b = new a.$Constructor()
    b.$key = 'b'
    var c = new a.$Constructor()
    c.$key = 'c'
    a.$val = 'hello'
    expect(cnt).to.equal(0)
    setTimeout(function () {
      expect(cnt).to.equal(3)
      done()
    }, 100)
  })

  it('fire for each using a random timeout', function (done) {
    var cnt = 0
    var deferCnt = 0
    var a = new Observable({
      $key: 'a',
      $on: {
        $data: {
          $val: function ( event ) {
            cnt++
          },
          $condition: {
            $val: function ( emit, event, defer ) {
              deferCnt++
              if (!this._timeout) {
                this._timeout = {}
              }

              this._timeout[this.$key] = setTimeout(emit, Math.random() * 20)
            },
            cancel: function () {
          
              clearTimeout(this._timeout[this.$key])
            }
          }
        }
      }
    })

    var b = new a.$Constructor()
    b.$key = 'b'
    var c = new a.$Constructor()
    c.$key = 'c'
    a.$val = 'hello'
    expect(cnt).to.equal(0)

    setTimeout(function () {
      expect(deferCnt).msg('defers fired').to.equal(3)
      expect(cnt).to.equal(3)
      done()
    }, 100)
  })

  it('fire for each using a random timeout, cancel for one instance', function (done) {
    var cnt = 0
    var deferCnt = 0
    var a = new Observable({
      $key: 'a',
      $on: {
        $data: {
          $val: function ( event ) {
            cnt++
          },
          $condition: {
            $val: function ( emit, event, defer ) {
              deferCnt++
              if (!this._timeout) {
                this._timeout = {}
              }
              this._timeout[this.$key] = setTimeout(emit, Math.random() * 20)
            },
            cancel: function () {
              clearTimeout(this._timeout[this.$key])
            }
          }
        }
      }
    })

    var b = new a.$Constructor()
    b.$key = 'b'
    var c = new a.$Constructor()
    c.$key = 'c'
    a.$val = 'hello'
    expect(cnt).to.equal(0)

    a.$on.$change.$condition.cancel()

    setTimeout(function () {
      expect(deferCnt).msg('defers fired').to.equal(3)
      expect(cnt).to.equal(2)
      done()
    }, 100)
  })

  it('fire for each using a random timeout, cancel for all', function (done) {
    var cnt = 0
    var deferCnt = 0
    var a = new Observable({
      $key: 'a',
      $on: {
        $data: {
          $val: function ( event ) {
            cnt++
          },
          $condition: {
            $val: function ( emit, event, defer ) {
              deferCnt++
              if (!this._timeout) {
                this._timeout = {}
              }
              this._timeout[this.$key] = setTimeout(emit, Math.random() * 20)
            },
            cancel: function () {
              clearTimeout(this._timeout[this.$key])
            }
          }
        }
      }
    })

    var b = new a.$Constructor()
    b.$key = 'b'
    var c = new a.$Constructor()
    c.$key = 'c'
    a.$val = 'hello'
    expect(cnt).to.equal(0)

    a.$on.$change.$condition.cancel(true)

    setTimeout(function () {
      expect(deferCnt).msg('defers fired').to.equal(3)
      expect(cnt).to.equal(0)
      done()
    }, 100)
  })

  it('streams', function (done) {
    var stream = require('stream')
    // var loader = new Element({
    //   $width:login.$progress
    // })

    setTimeout(function () {
      done()
    }, 1000)

  })
})

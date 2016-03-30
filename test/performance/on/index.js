var Obs = require('../../../lib/observable')
var util = require('../../../lib/util')
var Event = require('../../../lib/event')

describe('on change emitters', function () {
  it('on multiple instances', function ( done ) {
    var amount = 1e4
    var measure = 0
    this.timeout(50000)
    expect(function () {
      var A = new Obs({
        $key: 'a',
        $on: {
          $data: function () {
            measure++
          }
        }
      }).$Constructor

      var arr = []
      for ( var i = 0; i < amount; i++) {
        arr.push(new A({ i: i }))
      }
      expect(measure).to.equal(amount)
    }).performance({
      margin: 7,
      method: function () {
        var B = new Obs({
          $key: 'b'
        }).$Constructor
        var arr = []
        for ( var i = 0; i < amount; i++) {
          arr.push(new B({ i: i }))
        }
      }
    }, done)
  })

  it('update a', function ( done ) {
    this.timeout(50000)
    var amount = 1e5
    var measure = 0

    var instances = []
    var a = new Obs({
      $key: 'a',
      $on: {
        $data: function () {
          measure++
        }
      }
    })
    var A = a.$Constructor
    for (var i = 0; i < amount; i++) {
      instances.push(new A())
    }

    expect(function () {
      instances[0].$val = 'y'
    }).performance({
      method: function () {
        a.$val = 'x'
      },
      margin: (1 / amount) * 100 // add ms
    }, function () {
      expect(measure).to.equal((amount + 2))
      done()
    })
  })

})

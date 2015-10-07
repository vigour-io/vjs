'use strict'

describe('instances', function () {
  var fired = []
  var operator = []

  var Observable = require('../../../../lib/observable/')
  it('updates instances', function () {
    var a = new Observable({
      inject: require('../../../../lib/operator/all'),
      val: 'y',
      key: 'a',
      $add: 'xxx',
      on: {
        data: function () {
          fired.push(this.path[0])
        }
      }
    })
    var b = new a.Constructor({
      key: 'b'
    })
    var c = new b.Constructor({
      key: 'c'
    })
    fired = []
    a.$add.val = 200
    expect(fired).to.deep.equal([ 'c', 'b', 'a' ])
  })

  it('reference', function () {
    var reffed = new Observable()
    var a = new Observable({
      inject: require('../../../../lib/operator/all'),
      val: 'y',
      key: 'a',
      $add: function () {
        // work on bind for this...
        operator.push(this.key)
        return 'xxx'
      },
      on: {
        data: function () {
          this.val
          fired.push(this.path[0])
        }
      }
    })
    var b = new a.Constructor({
      key: 'b'
    })
    var c = new b.Constructor({
      key: 'c'
    })
    console.log('allright lets go')
    reffed.on(a.$add)
    fired = []
    operator = []
    reffed.val = 200
    expect(fired).to.deep.equal([ 'c', 'b', 'a' ])
    expect(operator).to.deep.equal([ 'c', 'b', 'a' ])
  })
})

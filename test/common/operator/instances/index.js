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
        data () {
          fired.push(this.path[0])
        }
      }
    })
    var b = new a.Constructor({
      key: 'b'
    })
    var c = new b.Constructor({ //eslint-disable-line
      key: 'c'
    })
    fired = []
    a.$add.val = 200
    expect(fired).to.deep.equal([ 'a', 'b', 'c' ])
  })

  it('reference', function () {
    var reffed = new Observable()
    var a = new Observable({
      inject: require('../../../../lib/operator/all'),
      val: 'y',
      key: 'a',
      $add () {
        // work on bind for this...
        operator.push(this.key)
        return 'xxx'
      },
      on: {
        data () {
          this.val
          fired.push(this.path[0])
        }
      }
    })
    var b = new a.Constructor({
      key: 'b'
    })
    var c = new b.Constructor({ //eslint-disable-line
      key: 'c'
    })
    reffed.on(a.$add)
    fired = []
    operator = []
    reffed.val = 200
    expect(fired).to.deep.equal([ 'a', 'b', 'c' ])
    expect(operator).to.deep.equal([ 'a', 'b', 'c' ])
  })
})

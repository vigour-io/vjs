'use strict'
var colors = require('colors-browserify') //eslint-disable-line
describe('context', function () {
  var Observable = require('../../../../lib/observable')
  var TestObs = new Observable({
    trackInstances: true,
    inject: require('../../../../lib/operator/transform'),
    ChildConstructor: 'Constructor'
  }).Constructor
  it('transform fires within context', () => {
    var arr = []
    var a = new TestObs({
      key: 'a',
      b: {
        $transform (val, operator) {
          return this.path.join('.')
        },
        on: {
          data () {
            arr.push(this.val)
          }
        }
      }
    })

    var a1 = new a.Constructor({ key: 'a1' }) // eslint-disable-line
    var a2 = new a.Constructor({ key: 'a2' }) // eslint-disable-line
    var a3 = new a.Constructor({ key: 'a3' }) // eslint-disable-line

    a.b.val = 'hello'

    expect(a.b._context).not.ok
    expect(a.b.$transform._context).not.ok
    expect(arr).to.deep.equal([
      'a1.b',
      'a2.b',
      'a3.b',
      'a.b'
    ])
  })

  it('transform fires within context, object', () => {
    var arr = []
    var ref = new Observable()
    var a = new TestObs({
      key: 'a',
      b: {
        val: ref,
        on: {
          data () {
            arr.push(this.path.join('.'))
          }
        }
      }
    })

    var c = new TestObs({ //eslint-disable-line
      key: 'c',
      ChildConstructor: a.Constructor,
      $transform: {
        a: true,
        b: true
      }
    })
    c.val
    ref.val = 'hello'
    expect(arr).to.deep.equal([
      'c._cache.a.b',
      'c._cache.b.b',
      'a.b'
    ])
    expect(c.val._context).not.ok
    expect(a._context).not.ok
    expect(a.b._context).not.ok
  })
})

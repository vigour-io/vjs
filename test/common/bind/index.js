describe('bind', function () {
  var Observable = require('../../../lib/observable')
  var Base = require('../../../lib/base')

  it('should bind "field" on parseval on base', function () {
    var bound
    var a = new Base({
      key: 'a',
      b: {
        bind: 'parent',
        val: function () {
          bound = this
        }
      }
    })
    a.b.val
    expect(bound.path).to.deep.equal(['a'])
  })

  it('should take functions into account', function () {
    var bound
    var a = new Base({
      key: 'a',
      b: {
        bind: function() {
          return this.parent
        },
        val: function () {
          bound = this
        }
      }
    })
    a.b.val
    expect(bound.path).to.deep.equal(['a'])
  })

  it('should bind the value on parseval on observable', function () {
    var bound
    var a = new Observable({
      key: 'a',
      c: {
        key:'c'
      },
      b: {
        bind: 'parent.c',
        val: function () {
          bound = this
        }
      }
    })
    a.b.val
    expect(bound.path).to.deep.equal(['a', 'c'])
  })

  it('should bind the value on emitter functions and attach listeners', function () {
    var a = new Observable({
      key: 'a',
      b: {
        bind: 'parent',
        on: {
          data: function (data, event) {
            console.log('bind it!', this.path)
          }
        }
      }
    })
    a.b.val = 'hello'
  })
})

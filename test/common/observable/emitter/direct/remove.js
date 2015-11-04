describe('remove emitter', function () {
  var Observable = require('../../../../../lib/observable')
  var isRemoved = require('../../../../../lib/util/is/removed')

  it('fires the remove emitter', function (done) {
    var a = new Observable({
      on: {
        remove: function () {
          done()
        }
      }
    })

    a.remove()
  })

  it('fires a nested remove emitter', function (done) {
    var a = new Observable({
      b: {
        on: {
          remove: function () {
            done()
          }
        }
      }
    })
    a.remove()
  })

  it('can be set using .on method', function () {
    var a = new Observable()
    var cnt = 0
    a.on('remove', function (data, event) {
      cnt++
    })
    var removeEmitter = a._on.removeEmitter
    a.remove()
    expect(cnt).to.equal(1)
    expect(isRemoved(removeEmitter))
  })

  it('can be removed using off', function () {
    var a = new Observable()
    function remove () {}
    a.on('remove', remove)
    a.off('remove', remove)
    expect(a._on.removeEmitter.fn).not.ok
  })
})

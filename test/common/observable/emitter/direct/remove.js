describe('remove emitter', function () {
  var Observable = require('../../../../../lib/observable')

  it('fires the remove emitter', function (done) {
    var a = new Observable({
      on: {
        remove: function () {
          done()
        }
      }
    })
    // console.log(a._on.removeEmitter)
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

  it('can be set using .on method', function (done) {
    var a = new Observable()
    a.on('remove', function (data, event) {
      done()
    })
  })
})

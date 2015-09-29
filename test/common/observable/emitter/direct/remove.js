describe('remove emitter', function () {
  var Observable = require('../../../../../lib/observable')

  it('fires remove listener', function(done) {
    var a = new Observable({
      on: {
        remove: function() {
          done()
        }
      }
    })
    // console.log(a._on.removeEmitter)
    a.remove()
  })
})

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
    a.remove()
  })
})

var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')

describe('array', function () {
  it('should fire all tracking info from array', function (done) {
    var example = ['new', 'parent', 'click', 'remove']
    var a = new Observable({
      b: {
        inject: tracking,
        on: {
          data: function (event, meta) {}
        },
        track: example
      }
    })

    var cnt = 0
    trackerEmitter.services.test = function (obj) {
      cnt++
      if (cnt === example.length) {
        expect(cnt).to.equal(4)
        expect(obj.name.val).to.equal('removeEmitter')
        done()
      }
      if (cnt === 3) {
        a.remove()
      }
    }
    for (var i = 0; i < example.length; i++) {
      if (example[i] !== 'remove') {
        a.b.emit(example[i])
      }
    }
  })
})

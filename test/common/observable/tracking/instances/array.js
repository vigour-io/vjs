var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('array', function () {
  it('should fire all tracking info from array', function (done) {
    var example = ['new', 'parent', 'click', 'remove']
    var a = new Observable({
      b: {
        inject: tracking,
        on: {
          data: function () {
          }
        },
        track: example
      }
    })

    var bInstance = new a.b.Constructor()

    var cnt = 0
    trackerEmitter.services.test = function (obj) {
      cnt++

      console.log('????',obj.eventobject.eventOriginator.val)

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
        bInstance.emit(example[i])
      }
    }
  })
})

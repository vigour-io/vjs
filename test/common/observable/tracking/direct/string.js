var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('string', function () {
  it('should override id if tracking val is a string', function (done) {
    var a = new Observable({
      b: {
        inject: tracking,
        on: {
          data: function (event, meta) {}
        },
        track: 'test string'
      }
    })
    trackerEmitter.services.test = function (obj) {
      expect(obj.id.val).to.have.string('test string')
      done()
    }
    a.b.emit('data')
  })
})

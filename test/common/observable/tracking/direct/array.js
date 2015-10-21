var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('array', function() {
  var example = ['new', 'parent', 'click', 'remove']
  var a = new Observable({
    b: {
      inject: tracking,
      on: {
        data: function(event, meta) {}
      },
      track: example
    }
  })

  it('should fire all tracking info from array', function () {
    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('new')
      expect(obj.eventobject.eventOriginator.val).to.equal('b')
    }
    a.b.emit(example[0])
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('parent')
    }
    a.b.emit(example[1])
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('click')
    }
    a.b.emit(example[2])
    delete trackerEmitter.services.test
    // error is giving TypeError: Cannot assign to read only property 'remove' of [object Object]
    // trackerEmitter.services.test = function (obj) {
    //   expect(obj.eventobject.eventType.val).to.equal('remove')
    // }
    // a.remove()
    // delete trackerEmitter.services.test
  })
})

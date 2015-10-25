var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('array', function() {
  var example = ['new', 'parent', 'click', 'remove']
  var a = new Observable({
    b: {
      track: example
    }
  })

  var bInstance = new a.b.Constructor({
    on: {
      data: function() {}
    },
    inject: tracking
  })

  it('should fire all tracking info from array', function() {
    trackerEmitter.services.test = function(obj) {
      expect(obj.eventobject.eventType.val).to.equal('new')
    }
    bInstance.emit(example[0])
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function(obj) {
      expect(obj.eventobject.eventType.val).to.equal('parent')
    }
    bInstance.emit(example[1])
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function(obj) {
      expect(obj.eventobject.eventType.val).to.equal('click')
    }
    bInstance.emit(example[2])
    delete trackerEmitter.services.test
  })
})

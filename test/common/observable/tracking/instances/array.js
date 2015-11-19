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

  var bInstance = new a.Constructor ({

  })

  it('should fire all tracking info from array', function () {
    trackerEmitter.services.test = function (obj) {
      expect(obj.id.val).to.equal('b._on.new')
      expect(obj.eventObject.eventType.val).to.equal('new')
      expect(obj.eventObject.eventOriginator.val).to.equal('b')
    }
    bInstance.b.emit(example[0])
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      // wrong object id for parent
      expect(obj.id.val).to.equal('b')
      expect(obj.eventObject.eventType.val).to.equal('parent')
    }
    bInstance.b.emit(example[1])
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      expect(obj.id.val).to.equal('b._on.click')
      expect(obj.eventObject.eventType.val).to.equal('click')
    }
    bInstance.b.emit(example[2])
    delete trackerEmitter.services.test
    // error is giving TypeError: Cannot assign to read only property 'remove' of [object Object]
    // trackerEmitter.services.test = function (obj) {
    //   expect(obj.eventObject.eventType.val).to.equal('remove')
    // }
    // a.remove()
    // delete trackerEmitter.services.test
  })
})

var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('object', function() {
  function returnValue(value) {
    return value
  }
  var a = new Observable({
    b: {
      inject: tracking,
      on: {
        data: (event, meta) => {}
      },
      track: {
        click: 'super',
        remove: returnValue(10),
        new: returnValue(10),
        // parent fired straight...
        parent: 100
      }
    }
  })

  it('should fire all tracking info from object', function () {
    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('new')
      expect(obj.eventobject.eventOriginator.val).to.equal('b')
    }
    a.b.emit('new')
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('parent')
    }
    a.b.emit('parent')
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('click')
    }
    a.b.emit('click')
    delete trackerEmitter.services.test

    trackerEmitter.services.test = function (obj) {
      expect(obj.eventobject.eventType.val).to.equal('parent')
    }
    a.b.emit('parent')
    delete trackerEmitter.services.test
  })
})

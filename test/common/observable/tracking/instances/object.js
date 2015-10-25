var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('object', () => {
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
        // new fired vaak
        new: returnValue(20),
        //parent ook
        parent: 100,
        remove: returnValue(10)
      }
    }
  })

  it('should override id if object val is a string', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.eventobject.eventType.val).to.equal('click')
      expect(obj.id.val).to.have.string('super')
    }
    a.b.emit('click')
    delete trackerEmitter.services.test
  })

  it('should handle parent', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.eventobject.eventType.val).to.equal('parent')
      expect(obj.eventobject.value).to.equal(100)
    }
    a.b.emit('parent')
    delete trackerEmitter.services.test
  })

  it('should handle new correctly', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.eventobject.eventType.val).to.equal('new')
      expect(obj.eventobject.value).to.equal(20)
    }
    a.b.emit('new')
    delete trackerEmitter.services.test
  })

  xit('should handle remove correctly', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.id.val).to.equal('b._on.remove')
      expect(obj.eventobject.value).to.equal(10)
      expect(obj.eventobject.eventType.val).to.equal('remove')
    }
    a.remove()
    delete trackerEmitter.services.test
  })
})

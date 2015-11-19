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

  var bInstance = new a.Constructor({

  })

  it('should override id if object val is a string', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.eventObject.eventType.val).to.equal('click')
      expect(obj.id.val).to.have.string('super')
    }
    bInstance.b.emit('click')
    delete trackerEmitter.services.test
  })

  it('should handle parent', () => {
    trackerEmitter.services.test = (obj) => {
      // parent has wrong id
      expect(obj.id.val).to.equal('b')
      expect(obj.eventObject.eventType.val).to.equal('parent')
      expect(obj.eventObject.value).to.equal(100)
    }
    bInstance.b.emit('parent')
    delete trackerEmitter.services.test
  })

  it('should handle new correctly', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.id.val).to.equal('b._on.new')
      expect(obj.eventObject.eventType.val).to.equal('new')
      expect(obj.eventObject.value).to.equal(20)
    }
    bInstance.b.emit('new')
    delete trackerEmitter.services.test
  })

  it('should handle remove correctly', () => {
    trackerEmitter.services.test = (obj) => {
      expect(obj.id.val).to.equal('b._on.remove')
      expect(obj.eventObject.value).to.equal(10)
      expect(obj.eventObject.eventType.val).to.equal('remove')
    }
    bInstance.remove()
    delete trackerEmitter.services.test
  })
})

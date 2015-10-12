var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')

describe('object', function () {
  it('should handle objects', function () {
    function returnValue (value) {
      return value
    }
    var ObjectwithObject = new Observable({
      b: {
        inject: tracking,
        on: {
          data: function (event, meta) {}
        },
        track: {
          click: 'super',
          remove: returnValue(10),
          new: returnValue(10),
          parent: 100
        }
      }
    })
    trackerEmitter.services.test = (obj) => {
      expect(obj).to.have.deep.property('eventobject')
    }
    ObjectwithObject.b.emit('new')
    ObjectwithObject.b.emit('parent')
    ObjectwithObject.b.emit('click')
    ObjectwithObject.b.emit('remove')
    delete trackerEmitter.services.test
  })
})

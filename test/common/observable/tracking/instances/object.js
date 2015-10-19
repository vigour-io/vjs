var Observable = require('../../../../../lib/observable/')
var tracking = require('../../../../../lib/tracking/')
var trackerEmitter = require('../../../../../lib/tracking/emitter')

describe('object', function () {
  it('should handle objects', function () {
    function returnValue (value) {
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
    trackerEmitter.services.test = (obj) => {

      expect(obj).to.have.deep.property('eventobject')
    }

    a.b.emit('parent')
    a.b.emit('new')
    a.b.emit('click')
    a.b.emit('remove')

    delete a.services.test
  })
})

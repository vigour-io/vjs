var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')

it('should handle objects', function (done) {
  function returnValue (value) {
    return value
  }

  var ObjectwithObject = new Observable ({
    b: {
      inject: tracking,
      on: {
        data: function(event, meta) {}
      },
      track: {
        click: 'super',
        // remove: returnValue(10),
        new: returnValue(10),
        // parent: returnValue(10)
        rickEvent: 600

      }
    }
  })
//event should contain custom value
  trackerEmitter.services.test = function (obj) {
    expect(obj)
      .to.have.deep.property('eventobject')
    done()
  }

  ObjectwithObject.b.emit('new')
  // ObjectwithObject.b.emit('parent')
  ObjectwithObject.b.emit('click')
  ObjectwithObject.b.emit('rickEvent')
  // ObjectwithObject.b.emit('remove')
})

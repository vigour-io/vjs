var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')
var Event = require('../../../../lib/event/')

// trackerEmitter.inject(require('../../../../lib/tracking/service/log'))

// this is just to log stuff (.toString yields nicer result for events)
// trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
Event.prototype.inject(require('../../../../lib/event/toString'))

console.clear()

describe('direct tracking', function () {

  it('reference (other event origin)', function (done) {
    var exampleReference = new Observable ({
      exampleKey: {
        key: 'aReference'
      }
    })

    var exampleObservable = new Observable ({
      b: {
        val: exampleReference.exampleKey,
        inject: tracking,
        on: {
          data: function (data, event) {}
        },
        track: true
      }
    })

    trackerEmitter.services.test = function (obj) {
      // check for change type
      console.log(obj)
      expect(obj.eventobject.eventOriginator.val).to.equal('aReference')
      done()
    }
    exampleReference.exampleKey.val = 'rick'
  })

  it('should contain all default keys', function (done) {
    var a = new Observable({
      key: 'a',
      b: {
        inject: tracking,
        on: {
          data: function(event, meta) {}
        },
        track: true
      }
    })

    trackerEmitter.services.test = function (obj) {
      expect(obj)
        .to.have.deep.property('eventobject')
      done()
    }
    a.b.emit('data')
  })

  it('should fire all tracking info from array', function (done) {
    var example = ['new', 'remove', 'parent', 'click']
    var a = new Observable({
      key: 'a',
      b: {
        inject: tracking,
        on: {
          data: function (event, meta) {}
        },
        track: example
      }
    })

    var cnt = 0
    trackerEmitter.services.test = function (obj) {
      cnt++
      // console.error(cnt, obj.convert({string:true}))
      if (cnt === example.length) {
        expect(cnt).to.equal(4)
        done()
      }
      if(cnt===3) {
        console.log(obj)
        a.remove()
      }
    }
    for (var i = 0; i < example.length; i++) {
      if (example[i] !== 'remove') {
        a.b.emit(example[i])
      }
    }
  })

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
          remove: returnValue(10),
          new: returnValue(10),
          parent: returnValue(10),
          customObject: {
            customProperty: 'customValue'
          }
        }
      }
    })
  //
    trackerEmitter.services.test = function (obj) {
      expect(obj)
        .to.have.deep.property('eventobject')
      done()
    }

    ObjectwithObject.b.emit('new')
    ObjectwithObject.b.emit('parent')
    ObjectwithObject.b.emit('click')
    ObjectwithObject.b.emit('remove')
    ObjectwithObject.b.emit('data')
  })

  it('should track an error event correctly', function (done) {
    var a = new Observable({
      key: 'a',
      b: {
        inject: tracking,
        on: {
          error: function (data, event) {}
        },
        track: true
      }
    })
    trackerEmitter.services.test = function (obj) {
      // check for error type (array || error)
      expect(obj.eventobject.metaMessage).to.be.ok
      expect(obj.eventobject.eventType.val).to.equal('error')
      done()
    }
    a.b.emit('error')
  })

  it('should override id if tracking val is a string', function (done) {
    var a = new Observable({
      key: 'a',
      b: {
        inject: tracking,
        on: {
          data: function(event, meta) {}
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

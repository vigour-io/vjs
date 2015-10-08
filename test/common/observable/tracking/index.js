var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')
var Event = require('../../../../lib/event/')

// trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
// this is just to log stuff (.toString yields nicer result for events)
trackerEmitter.inject(require('../../../../lib/tracking/service/log'))
Event.prototype.inject(require('../../../../lib/event/toString'))

describe('direct tracking', function () {
  xit('should contain all default keys', function (done) {
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
  xit('should fire all tracking info from array', function (done) {
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
        a.remove()
      }
    }
    for (var i = 0; i < example.length; i++) {
      if (example[i] !== 'remove') {
        a.b.emit(example[i])
      }
    }
  })

  xit('reference (other event origin)', function (done) {
    var exampleReference = new Observable({
      b: {
        key: 'aReference'
      }
    })

    var a = new Observable({
      key: 'a',
      b: {
        val: exampleReference.b,
        inject: tracking,
        on: {
          data: function (data, event) {}
        },
        track: true
      }
    })

    trackerEmitter.services.test = function (obj) {
      // check for change type
      expect(obj.eventobject.eventOriginator.val).to.equal('aReference')
      done()
    }
    exampleReference.b.val = 'rick'
  })

  xit('should track an error event correctly', function (done) {
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

  xit('should override id if tracking val is a string', function (done) {
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

  it('should handle objects', function (done) {

    function returnValue (value) {
      return value
    }

    var a = new Observable({
      key: 'a',
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
          parent: {
            customProperty: 'customValue'
          },
        }
      }
    })

    trackerEmitter.services.test = function (obj) {
      done()
    }
    a.b.emit('new')
    a.b.emit('parent')
    a.b.emit('click')
    a.b.emit('remove')
    a.b.emit('data')
  })
})

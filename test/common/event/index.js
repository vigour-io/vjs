'use strict'
var Event = require('../../../lib/event/')
var Emitter = require('../../../lib/emitter/')

describe('event', function () {
  var theOrigin = {}

  it('should have stamp', function () {
    var rahhEvent = new Event(theOrigin)
    expect(rahhEvent.stamp).to.be.ok
  })

  it('should increase stamp when there is a new event', function () {
    var justAnotherEvent = new Event(theOrigin)
    expect(justAnotherEvent.stamp).to.be.ok
  })

  it('should be able to create an event with type', function () {
    var myType = {}
    var eventWithOrigin = new Event(theOrigin, myType)
    expect(eventWithOrigin.type).to.be.defined
  })

  describe('push method', function () {
    var myEvent = new Event(theOrigin)
    it('should has the push method', function () {
      expect(myEvent.push).to.be.defined
      expect(myEvent.push).to.be.a.function
    })
    it('should add an emmiter to queue array', function () {
      var emitter = new Emitter()
      myEvent.push(emitter)
      expect(myEvent.queue).to.be.defined
      expect(myEvent.queue).to.be.an.array
      expect(myEvent.queue).to.have.length(1)
    })
  })

  describe('flavour', function () {
    var randomObject = {}
    Event.flavour(randomObject)
    it('should has the push method', function () {
      expect(randomObject.push).to.be.defined
      expect(randomObject.push).to.be.a.function
    })
    it('should add an emmiter to queue array', function () {
      var emitter = new Emitter()
      randomObject.push(emitter)
      expect(randomObject.queue).to.be.defined
      expect(randomObject.queue).to.be.an.array
      expect(randomObject.queue).to.have.length(1)
    })
  })
})

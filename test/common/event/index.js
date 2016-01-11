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
})

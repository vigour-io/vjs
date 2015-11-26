'use strict'
var Observable = require('../../../../../lib/observable/')

describe('new event', function () {
  it('should fire the `new` event when instantiating instances', function () {
    var spy = sinon.spy()
    var Custom = new Observable({
      on: {
        new: spy
      }
    }).Constructor
    var custom = new Custom()
    var special = new Custom()
    expect(custom).instanceOf(Observable)
    expect(special).instanceOf(Observable)
    expect(spy).calledTwice
  })
  it(
    'should have its properties defined (from the setObject passed to the ' + 
    'Constructor), when `new` eventHandlers are called', 
    function () {
      var Custom = new Observable({
        prop1: {
          nest: 3
        },
        on: {
          new () {
            var instance = this
            expect(instance).to.have.property('prop1')
              .which.has.property('nest')
              .which.has.property('val', 3)
          }
        }
      }).Constructor
      var custom = new Custom()
    }
  )
})

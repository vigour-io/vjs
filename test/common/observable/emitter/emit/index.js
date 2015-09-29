var Observable = require('../../../../../lib/observable/')
var custom = new Observable({})
describe('emit', function () {
  it('should fire the specified event', function () {
    var spy = sinon.spy()
    var eventName = 'customEvent'
    var payload = { key: 'value' }
    custom.on(eventName, spy)
    custom.emit(eventName, payload)
    expect(spy).called
  })
})

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
})

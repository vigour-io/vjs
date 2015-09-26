describe('basics', function () {
  var Observable = require('../../../../lib/observable')

  it('create new observable (obs)', function () {
    var specialobs = new Observable(10)
    expect(specialobs).instanceof(Observable)
    expect(specialobs.val).equals(10)
  })
})

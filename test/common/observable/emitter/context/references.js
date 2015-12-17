describe('references', function () {
  var Observable = require('../../../../../lib/observable')

  it('listener fires on both class and instance when updating class, val update', function () {
    var measure = {
      a: 0,
      a1: 0,
      a2: 0
    }
    var b = new Observable()

    var a = new Observable({
      key: 'a',
      trackInstances: true,
      nested: b
    })

    var aInstance = new a.Constructor({ key: 'a1' })
    var aInstance2 = new a.Constructor({ key: 'a2' })

    a.nested.on(function () {
      measure[this.path[0]]++
    })

    b.val = 20

    expect(measure.a).to.equal(1)
    expect(measure.a1).to.equal(1)
    expect(measure.a2).to.equal(1)
  })
})

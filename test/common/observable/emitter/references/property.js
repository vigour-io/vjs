describe('property', function () {
  var Observable = require('../../../../../lib/observable/')
  // var Event = require('../../../../../lib/event')

  it('should add a nested listener', function () {
    var a = new Observable()
    var b = new Observable()
    var c = new Observable()
    // var aEvent = new Event()
    a.set({
      properties: {
        c: c
      }
    })
    var nested = new Observable()
    a.set({
      c: { val: true }
    })
    console.log(a.c)
    b.set({
      nested: { c: a.c }
    })
    console.log(b.nested)

    expect(b.nested.c).has.property('_input').which.equals(a.c)
  })

})

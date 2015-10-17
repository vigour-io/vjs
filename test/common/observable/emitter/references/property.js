describe('property', function () {
  var Observable = require('../../../../../lib/observable/')
  // var Event = require('../../../../../lib/event')

  it('should add a nested listener', function () {
    var a = new Observable()
    var b = new Observable()
    // var aEvent = new Event()
    a.set({
      ChildConstructor: 'Constructor'
    })
    var nestedConstructor = new Observable()

    var nested = new Observable({
      ChildConstructor: nestedConstructor.Constructor
    })
    b.set({
      properties: {
        nested: nested
      }
    })

    a.set({
      c: { val: true }
    })

    b.set({
      nested: { c: a.c }
    })
    expect(b.nested.c).has.property('_input').which.equals(a.c)
  })



})

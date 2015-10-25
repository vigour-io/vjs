describe('property', function () {
  var Observable = require('../../../../../lib/observable/')
  it('should add a nested listener', function () {
    var a = new Observable()
    var b = new Observable()
    var c = new Observable()
    a.set({
      properties: {
        c: c
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

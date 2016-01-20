'use strict'
describe('property', function () {
  var Observable = require('../../../../../lib/observable/')
  it('should add a nested listener', function () {
    var a = new Observable()
    var b = new Observable()
    var c = new Observable({
      key: 'yo',
      val: 'mybitch'
    })
    a.set({
      key: 'a',
      properties: {
        c: c
      }
    })
    a.set({
      c: true
    })


    console.clear()
    b.set({
      key: 'b',
      nested: { c: a.c }
    })

    // WRONG USEVAL
    // console.log('xxxxxxxxxxx>>>>>>', b.nested.c._input. b.nested.c)
    console.log('===:', b.nested.c === a.c)
    console.log(a.c._path, b.nested.c)
    console.log(b.nested.c._path)
    expect(b.nested.c).has.property('_input').which.equals(a.c)
  })
})

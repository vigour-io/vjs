'use strict'
describe('ChildConstructor', function () {
  var Observable = require('../../../../../../lib/observable')
  var lastData, lastKeys
  // var Event = require('../../../../../../lib/event')
  beforeEach(function () {
    lastData = []
    lastKeys = []
  })
  var A = new Observable({
    key: 'a',
    on: {
      data: {
        something (data) {
          lastData.push(data)
          lastKeys.push(this.path.join('.'))
        }
      }
    },
    ChildConstructor: 'Constructor'
  }).Constructor
  var b
  var c

  it('fires listeners in context on creation', function () {
    b = new A({
      key: 'b',
      field3: 'field3'
    })
  })

  it('fires listeners for a second context', function () {
    c = new b.Constructor({
      key: 'c',
      field: 'field',
      field2: 'field2'
    })
    expect(lastData).to.deep.equal([
      'field',
      'field2',
      {
        key: 'c',
        field: 'field',
        field2: 'field2'
      }
    ])
  })

  it('passes null on remove', function () {
    c.field2.remove() // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ null, void 0 ])
  })

  it('passes null on remove using set object', function () {
    c.set({ field: null }) // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ null, void 0 ])
  })

  it('passes null on constructor remove using set object', function () {
    b.set({ field3: null }) // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ null, null, void 0, void 0 ])
  })

  it('works for multiple fields with references', function () {
    var c = new A({ key: 'c_childconstructor' }).Constructor

    var b = new Observable({
      ChildConstructor: c
    })

    var d = new b.Constructor({
      ChildConstructor: c
    })

    var x = new b.Constructor({
      c: {
        ref: d,
        bla: true,
        flurps: {
          on: {
            data () {}
          }
        },
        val: 'c'
      }
    })

    var f = new A({ //eslint-disable-line
      key: 'f',
      val: x // should fire!!!!
    })
    lastData = []
    lastKeys = []
    x.remove()
    // c flurps is later since it its own isntance of the shared emitter
    expect(lastKeys).to.deep.equal(['c.ref', 'c.bla', 'c', 'c.flurps', 'f'])
    expect(lastData).to.deep.equal([null, null, null, null, null])
  })
})

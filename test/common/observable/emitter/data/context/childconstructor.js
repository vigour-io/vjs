'use strict'
describe('ChildConstructor', function () {
  var Observable = require('../../../../../../lib/observable')
  var lastData
  beforeEach(function () {
    lastData = []
  })
  var A = new Observable({
    key: 'a',
    on: {
      data (data) {
        lastData.push(data)
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
    expect(lastData).to.deep.equal([ void 0, null ])
  })

  it('passes null on remove using set object', function () {
    c.set({ field: null }) // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ null, void 0 ])
  })

  it('passes null on constructor remove using set object', function () {
    b.set({ field3: null }) // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ null, null, void 0, void 0 ])
  })
})

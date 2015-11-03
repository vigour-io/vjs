'use strict'
describe('context', function () {
  var Observable = require('../../../../../lib/observable')
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
  var b //eslint-disable-line

  it('fires listeners in context on creation', function () {
    b = new A({
      key: 'b',
      field: 'field',
      field2: 'field2'
    })
    expect(lastData).to.deep.equal([
      'field',
      'field2',
      {
        key: 'b',
        field: 'field',
        field2: 'field2'
      }
    ])
  })

  it('passes null on remove', function () {
    b.field2.remove() // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ void 0, null ])
  })

  it('passes null on remove using set object', function () {
    b.set({ field: null }) // order changes since now this is the last executioner
    expect(lastData).to.deep.equal([ null, void 0 ])
  })
})

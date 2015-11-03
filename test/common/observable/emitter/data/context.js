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
      field: 'field'
    })
    expect(lastData[0]).to.deep.equal('field')
    expect(lastData[1]).to.deep.equal({
      key: 'b',
      field: 'field'
    })
  })

  it('passes null on remove', function () {
    b.set({ field: null }) // order changes since now this is the last executioner
    expect(lastData[0]).to.deep.equal(null)
  })
})

'use strict'
describe('property', function () {
  var Observable = require('../../../../../../lib/observable')
  var lastData
  beforeEach(function () {
    lastData = []
  })
  var A = new Observable({
    key: 'a',
    on: {
      property (data) {
        lastData.push(data)
      }
    },
    ChildConstructor: 'Constructor'
  }).Constructor
  var b
  var c

  it('passes added fields for new properties', function () {
    b = new A({
      key: 'b',
      field3: 'field3'
    })
    expect(lastData[0])
      .to.have.property('added')
      .which.deep.equals(['field3'])
  })

  it('passes added fields for new properties', function () {
    // double check this
    c = new b.Constructor({
      key: 'c',
      field: 'field',
      field2: 'field2'
    })
    expect(lastData).to.deep.equal([{
      added: [ 'field', 'field2' ]
    }])
  })

  it('passes removed fields on remove', function () {
    c.field2.remove()
    expect(lastData).to.deep.equal([{ removed: [ 'field2' ] }])
  })

  it('passes removed fields on remove using set object', function () {
    c.set({ field: null })
    expect(lastData).to.deep.equal([{ removed: [ 'field' ] }])
  })

  it('passes removed fields on constructor remove using set object', function () {
    b.set({ field3: null })
    expect(lastData).to.deep.equal([
      { removed: [ 'field3' ] },
      { removed: [ 'field3' ] }
    ])
  })
})

'use strict'
var Observable = require('../../../../../lib/observable')

describe('Data Object', function () {
  var obs = new Observable()
  var res
  obs.subscribe({
    field1: true,
    field2: true
  }, function (data, event) {
    res = data
  })

  it('gets correct data when adding both props', function () {
    obs.set({
      field1: 1,
      field2: 2
    })
    expect(res.length).equals(2)
  })
})

'use strict'
var Observable = require('../../../../../lib/observable')

describe('Data Object', function () {
  var obs = new Observable()
  obs.subscribe({
    field1: true,
    field2: true
  }, function (data, event) {
    console.log('fires:', data)
  })

  it('gets correct data when adding both props', function(){
    obs.set({
      field1:1,
      field2:2
    })
    
  })
})
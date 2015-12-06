'use strict'
var Observable = require('../../../../../lib/observable')
var testListeners = require('../testListeners')
var countOne
var countTwo

beforeEach(function () {
  countOne = 0
  countTwo = 0
})

describe('support .val', function () {
  var obs = new Observable({
    field:{
      nested:3
    }
  })

  var sub = obs.subscribe({
    field: {
      val: true,
      nested: true
    }
  }, function (data) {
    countOne++
    console.log('fire!',this.path, data.origin.path)
  })

  it('should fire for both obs.field and obs.field.nested', function(){
    obs.field.val = 3
    obs.field.nested.val = 2
    expect(countOne).equals(2)
  })

})

'use strict'

describe('inject', function () {
  var Observable = require('../../../../lib/observable')
  var cnt = 0
  var injectable = {
    something: {
      on: {
        data (data) {
          cnt++
        }
      }
    }
  }

  beforeEach(function () {
    cnt = 0
  })

  it('can inject a module, fires listener on a field that gets set', function () {
    var a = new Observable({ //eslint-disable-line
      inject: injectable,
      something: true
    })
    expect(cnt).to.equal(1)
  })
})

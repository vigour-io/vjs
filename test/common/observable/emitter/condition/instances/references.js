'use strict'

describe('references', function () {
  var Observable = require('../../../../../../lib/observable')
  it('should fire conditions over references over instances', function (done) {
    var cnt = 0
    var b = new Observable({
      val: a
    })
    var a = new Observable({
      key: 'a',
      val: b,
      on: {
        data: {
          condition: function (val) {
            cnt++
            if (cnt === 2) {
              expect(val).equals(200)
              done()
            }
          }
        }
      }
    })
    var c = new a.Constructor() //eslint-disable-line
    b.val = 200
  })
})

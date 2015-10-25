var Observable = require('../../../../../../lib/observable')

describe('multiple conditions', function () {
  it('waits for all conditions', function (done) {
    var count = 0
    var a = new Observable({
      val: 10,
      on: {
        data: {
          condition: {
            one: function (data, cb, event) {
              count += 1
              setTimeout(cb, data)
            },
            two: function (data, cb, event) {
              count += 1
              setTimeout(cb, data)
            }
          },
          val: function () {
            expect(count).to.equal(2)
            if (count === 2) {
              done()
            }
          }
        }
      }
    })
    a.val = 20
  })
})

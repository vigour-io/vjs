describe('direct', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var a = new Observable({
      val: 10,
      on: {
        data: {
          condition: function (data, cb, event) {
            if (data > 0) {
              setTimeout(cb, data)
            } else {
              cb(new Error('make number', data))
            }
          },
          val: function () {
            done()
          }
        }
      }
    })
    a.val = 20
  })

  it('fires condition over references', function (done) {
    var b = new Observable()
    var a = new Observable({
      val: b,
      on: {
        data: {
          condition: function (data, cb, event) {
            if (data > 0) {
              setTimeout(cb, data)
            } else {
              cb(new Error('make number', data))
            }
          },
          val: function () {
            done()
          }
        }
      }
    })
    b.val = 20
  })

  it('fires error', function (done) {
    var a = new Observable({
      val: 10,
      on: {
        error: function (data) {
          done()
        },
        data: {
          condition: function (data, cb, event) {
            if (data > 0) {
              setTimeout(cb, data)
            } else {
              // also data
              cb(new Error('make number'))
            }
          }
        }
      }
    })
    a.val = 'aaa'
  })
})

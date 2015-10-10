describe('instances', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(done, 10)
          },
          val: function () {
            cnt++
            if (cnt === 2) {
              done()
            }
          }
        }
      }
    })
    var b = new a.Constructor()
    a.val = 'a change!'
  })
})

describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      key:'a',
      time: 200,
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(done, this.time.val)
          },
          val: function () {
            cnt++
            if (cnt === 3) {
              done()
            }
          }
        }
      }
    })

    var b = new a.Constructor({time: 300})
    var c = new b.Constructor({time: 500})
    a.val = 'a change!'
  })
})

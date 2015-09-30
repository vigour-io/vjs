describe('instances', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      on: {
        data: {
          condition: function (done, event) {
            setTimeout(done, 1000)
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
    // fire for b and a
  })
})

describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var a = new Observable({
      time: 200,
      on: {
        data: {
          condition: function (done, event) {
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
    // needs a very easy subscribe
    // basicly you always want to listen to all properties for a condtion
    // when you set bind takes this into account in subscription!
    var b = new a.Constructor({time: 300})
    var c = new b.Constructor({time: 500})
    a.val = 'a change!'
    // ignore all that are not part of this chain
    // same for all normal events
    // fire for b and a
  })
})

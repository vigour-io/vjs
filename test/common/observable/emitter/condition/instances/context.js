'use strict'
describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var xcnt = 0
    setInterval(function () {
      if (xcnt < 1000) {
        xcnt += 50
        console.warn('tick:', xcnt)
      }
    }, 50)
    console.clear()
    // var fired = []
    var a = new Observable({
      key: 'a',
      time: 100,
      on: {
        data: {
          condition (data, next, event) {
            console.log('   fire condition in test:'.green.bold, '     ', event.stamp, this.path, this.time.val) // wrong context!
            setTimeout(() => next(), this.time.val)
          },
          val (data) {
            console.log('fire listener (condition passed)'.green.bold.inverse, ' path: "' + this.path.join('.') + '"', data)
          }
        }
      }
    })
    console.log('---------------------------------')
    var b = new a.Constructor({ key: 'b', time: 300 })
    console.log('uids:'.grey.bold, ' a:', a.uid, 'b:', b.uid)
    // var c = new b.Constructor({time: 30, key: 'c'}) // eslint-disable-line
    console.log('-----------a change--------------')
    // a en b!
    a.val = 'a change!'
  })

  xit('fires condition trigger on resolved context', function (done) {
    var a = new Observable({
      key: 'a',
      time: 10,
      on: {
        data: {
          condition: function (data, next, event) {
            next()
          }
        }
      }
    })
    var b = new a.Constructor()
    b.on(() => done())
    b.val = 'value'
  })
})

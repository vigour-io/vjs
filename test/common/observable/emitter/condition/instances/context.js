'use strict'
describe('context', function () {
  var Observable = require('../../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var cnt = 0
    var dataCnt = 0
    var fired = []
    var a = new Observable({
      key: 'a',
      time: 10,
      on: {
        data: {
          condition: function (data, done, event) {
            setTimeout(() => done(), this.time.val)
          },
          val: function (data) {
            fired.push(this.path[0])
            cnt++
            if (data === 'a change!') {
              dataCnt++
            }
            if (cnt === 5 && dataCnt === 3) {
              // expect(fired).to.deep.eql(['b', 'c', 'a', 'b', 'c'])
              done()
            }
          }
        }
      }
    })
    var b = new a.Constructor({time: 200, key: 'b'})
    var c = new b.Constructor({time: 30, key: 'c'})
    a.val = 'a change!'
  })

  it('fires condition trigger on resolved context', function (done) {
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

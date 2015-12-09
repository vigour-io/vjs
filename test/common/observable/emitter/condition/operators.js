'use strict'
describe('operators', function () {
  var Observable = require('../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var a = new Observable({
      inject: require('../../../../../lib/operator/all'),
      key: 'a',
      $transform: {
        order: -1,
        val (val) {
          return 'hey'
        }
      },
      on: {
        data: {
          condition: {
            inject: require('../../../../../lib/operator/all'),
            $transform (val, next, event, data) {
              expect(val).to.equal('hey')
              return 'lol'
            },
            val (val, next, event, data) {
              expect(val).to.equal('lol')
              next()
            }
          },
          val (data) {
            done()
          }
        }
      }
    })
    a.val = 'hello!'
  })

  it('cancel on false', function () {
    // replace this behaviour
    var cnt = 0
    var a = new Observable({
      key: 'a',
      on: {
        data: {
          condition: {
            val: function (val, next, event) {
              cnt++
            }
          },
          val: function (data) {
            // done()
          }
        }
      }
    })

    a.val = false
    expect(cnt).to.equal(0)
  })
})

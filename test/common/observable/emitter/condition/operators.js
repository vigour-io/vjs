describe('operators', function () {
  var Observable = require('../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    var a = new Observable({
      inject: require('../../../../../lib/operator/all'),
      key: 'a',
      $transform: {
        order: -1,
        val: function (val) {
          return 'hey'
        }
      },
      on: {
        data: {
          condition: {
            inject: require('../../../../../lib/operator/all'),
            $transform: function (val) {
              expect(val).to.equal('hey')
              return 'lol'
            },
            val: function (val, next) {
              expect(val).to.equal('lol')
              next()
            }
          },
          val: function (data) {
            done()
          }
        }
      }
    })
    a.val = 'hello!'
  })

  it('cancel on false', function () {
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

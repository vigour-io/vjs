
describe('operators', function () {
  var Observable = require('../../../../../lib/observable')
  it('fires condition trigger', function (done) {
    console.clear()
    var cnt = 0
    var a = new Observable({
      inject: require('../../../../../lib/operator/all'),
      key: 'a',
      $transform: {
        order: -1,
        val: function (val) {
          console.log('DOING TRANSFORM!', this.path, val)
          return 'hey'
        }
      },
      on: {
        data: {
          condition: {
            inject: require('../../../../../lib/operator/all'),
            $transform: function (val) {
              console.log('lulz', val, this.path)
              return 'lol!'
            },
            val: function (val) {
              console.error('haha its in the condition')
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
})

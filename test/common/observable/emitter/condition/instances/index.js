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
    console.clear()
    var cnt = 0
    var a = new Observable({
      key:'a',
      time: 200,
      on: {
        data: {
          condition: function (data, done, event) {
            console.log('??hey hey hey??')
            console.log('bitch do my update')

            setTimeout(done, this.time.val)
          },
          val: function (data) {
            cnt++
            console.log('time', cnt, this.path, data)
            if (cnt === 3) {
              done()
            }
          }
        }
      }
    })

    console.warn('OK BITCH 1')
    var b = new a.Constructor({time: 300, key: 'b'})
    console.warn('OK BITCH 2')
    var c = new b.Constructor({time: 500, key: 'c'})
    console.warn('OK BITCH')
    a.val = 'a change!'
  })
})

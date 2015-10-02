describe('bind', function () {
  var Observable = require('../../../lib/observable')
  it('should bind the value on parseval', function () {
    var a = new Observable({
      key: 'a',
      b: {
        bind: 'parent',
        val: function () {
          //no bind...
          console.log(this.path)
        }
      }
    })
    a.b.val
  })

  it('should bind the value on emitter functions and attach listeners', function () {
    var a = new Observable({
      key: 'a',
      b: {
        bind: 'parent',
        on: {
          data: function (data, event) {
            console.log(this.path)
          }
        }
      }
    })
    a.b.val = 'hello'
  })
})

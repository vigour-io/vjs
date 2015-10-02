describe('bind', function () {
  var Observable = require('../../../lib/observable')
  it('should bind the value on parseval', function () {
    var a = new Observable({
      key: 'a',
      b: {
        bind: 'parent',
        val: function () {
          console.log(this.path)
        }
      }
    })
  })
})

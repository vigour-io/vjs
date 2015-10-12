describe('object ', function () {
  var Observable = require('../../../../lib/observable')
  var a

  it('create a new observable, use objects, create cache object', function () {
    console.clear()
    a = new Observable({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      b: 'its b',
      $add: function () {
        return { c: 'its c' }
      }
    })
    expect(a.val).equals(a._cache)
  })
})

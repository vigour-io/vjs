describe('object ', function () {
  var Observable = require('../../../../lib/observable')

  // it should create a results observable
  // result is a listlike object -- make the key moving easy (tmrw)

  it('create a new observable, use objects, create results object', function () {
    console.clear()
    var a = new Observable({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      b: 'its b',
      $add: function () {
        return { c: 'its c' }
      }
    })

    console.log(a.val)

  })
})

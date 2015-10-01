describe('direct', function () {
  var Base = require('../../../../lib/observable')
  var a

  it('create new observable (obs), add change listener', function () {
    a = new Base({
      inject: require('../../../../lib/operator/inject'),
      key: 'a',
      val: 'hello',
      $add: 'gurk'
    })
    console.log(a.val)
    expect(a.val).to.equal('hellogurk')
  })
})

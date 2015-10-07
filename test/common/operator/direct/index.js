describe('direct', function () {
  var Base = require('../../../../lib/observable')
  var a

  it('create a new base inject operators', function () {
    a = new Base({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      val: 'hello',
      $add: 'gurk'
    })
    expect(a.val).to.equal('hellogurk')
  })

  // still gets wrong order bu defailt
  xit('create a new base inject operators, check if order works', function () {
    a = new Base({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      val: 'no',
      $transform: function () {
        return 'hello'
      },
      $add: 'gurk'
      // now it takes the order of things in the operators thing -- however it should be set when you set the field
      // add order when setting a operator
    })
    expect(a.val).to.equal('hellogurk')
  })
})

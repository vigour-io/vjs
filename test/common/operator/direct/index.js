describe('base', function () {
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

  // still gets wrong order by defailt
  it('create a new base inject operators, check if order works', function () {
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
    console.warn('?x')
    console.log(a._operators, a.val)
    // delete a._operators
    console.warn('?x', a._operators)

    console.error('\n\n\n\nXXxx-----------------------------------------------------------xxXXXX')
    expect(a.val).to.equal('hellogurk')
  })
})

describe('observable', function () {
  var Observable = require('../../../../lib/observable')
  var a

  it('create a new base inject operators', function () {
    a = new Observable({
      inject: require('../../../../lib/operator/all'),
      key: 'a',
      val: 'hello',
      $add: 'gurk'
    })
    expect(a.val).to.equal('hellogurk')
  })
})

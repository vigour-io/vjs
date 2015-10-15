describe('direct', function () {

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
  })

  describe('observable', function () {
    var Observable = require('../../../../lib/observable')
    var a

    it('create a new base inject operators', function () {
      console.clear()
      a = new Observable({
        inject: require('../../../../lib/operator/all'),
        key: 'a',
        val: 'hello',
        $add: 'gurk'
      })
      expect(a.val).to.equal('hellogurk')
    })

    // still gets wrong order by defailt
    it('create a new Observable inject operators, check if order works', function () {
      console.clear()
      a = new Observable({
        inject: require('../../../../lib/operator/all'),
        key: 'a',
        val: 'no',
        $transform () {
          return 'hello'
        },
        $add: 'gurk'
        // now it takes the order of things in the operators thing -- however it should be set when you set the field
        // add order when setting a operator
      })
      console.log('done mofo done!')
      // delete a._operators
      expect(a.val).to.equal('hellogurk')
    })
  })

  require('./object')
})

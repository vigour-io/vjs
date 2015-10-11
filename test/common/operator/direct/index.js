describe('direct', function () {

  describe('base', function () {
    var Base = require('../../../../lib/observable')
    var a

    var x = new Base({
      blurf: 'hey hey hey',
      x: true
    })

    for(var i of x) {
      console.log('?', i)
    }

    console.log( '??',[...x] )

    // function ax(...x) {
    //   console.log('x?', x)
    // }
    // ax(x)

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
      // delete a._operators
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

})

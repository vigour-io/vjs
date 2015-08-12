describe('context', function() {

  var Observable = require('../../../../../lib/observable')

  function contextObservable() {
    var cnt = {
      total: 0
    }

    var a = new Observable({
      $key:'a',
      $trackInstances: true,
      //no on so on default no trackinstances
      b: {
        $on: {
          $change:function() {
            var key = this.$path[0]
            console.error('\nFIRE IT--->????', cnt[key], key, this._$context &&  this._$context.$path)
            cnt[key] = cnt[key] ? cnt[key]+1 : 1
            cnt.total++
          }
        }
      }
    })

    var b = new a.$Constructor({
      $key:'b'
    })

    return {
      cnt: cnt,
      a: a,
      b: b
    }
  }

  describe( 'emit on instance', function() {
    var test = contextObservable()
    //dit is resolve context shit
    test.b.b.$emit('$change') // = 'b change'
    it( 'should fire once for "b" context' , function() {
      expect( test.cnt.b ).to.equal( 1 )
    })
    it( 'should fire once in total' , function() {
      expect( test.cnt.total ).to.equal( 1 )
    })
  })

  describe( 'set on instance', function() {
    var test = contextObservable()
    //dit is resolve context shit
    test.b.b.$val = 'b change'
    it( 'should fire once for "b" context' , function() {
      expect( test.cnt.b ).to.equal( 1 )
    })
    it( 'should fire once in total' , function() {
      expect( test.cnt.total ).to.equal( 1 )
    })
  })

  describe( 'multiple instances', function() {
    var test = contextObservable()

    var c = new test.a.$Constructor({
      $key:'c'
    })

    test.a.b.$val = 'a change'
    it( 'should fire once for "a" context' , function() {
      expect( test.cnt.a ).to.equal( 1 )
    })
    it( 'should fire once for "b" context' , function() {
      expect( test.cnt.b ).to.equal( 1 )
    })
    it( 'should fire once for "c" context' , function() {
      expect( test.cnt.c ).to.equal( 1 )
    })
    it( 'should fire 3 times in total' , function() {
      expect( test.cnt.total ).to.equal( 3 )
    })
  })

  describe( 'multiple contexts and instances', function() {
    var test = contextObservable()

    test.c = new test.a.$Constructor({
      $key:'c'
    })

    it( 'sets b and should fire once for "d" instance' , function() {
      test.d = new test.a.$Constructor({
        $key: 'd',
        b:'b' //you should not fire for original!
      })
      expect( test.cnt.d ).to.equal( 1 )
    })

    it( 'sets a.b and should fire once for "a" context' , function() {
      test.a.b.$val = 'a'
      expect( test.cnt.a ).to.equal( 1 )
    })

    it( 'should fire twice for "d"' , function() {
      expect( test.cnt.d ).to.equal( 2 )
    })

    it( 'should not fire for "c"' , function() {
      expect( test.cnt.c ).to.not.be.ok
    })

  })

  describe( 'context and nested instances', function() {
    var test = contextObservable()
    console.clear()

    it( 'should create a new a.b (c) should fire once for c', function() {
      console.clear()
      test.c = new test.a.b.$Constructor({
        $key:'c'
      })
      expect( test.cnt.c ).to.equal( 1 )
    })

    it( 'sets a.b, should fire once for "a" context' , function() {
      test.a.b.$val = 'a change'
      expect( test.cnt.a ).to.equal( 1 )
    })

    it( 'should fire once for "c" context' , function() {
      expect( test.cnt.c ).to.equal( 2 )
    })

    it( 'should fire 3 times in total' , function() {
      expect( test.cnt.total ).to.equal( 3 )
    })
  })

  //add nog de simpelere test om context + changing contexts van hetzelfde

  describe.skip( 'multiple contexts and different instances', function() {
    var test = contextObservable()

    it( 'should create a new a.b (c) and d (nest observable)', function() {

      test.c = new test.a.b.$Constructor({
        $key:'c'
      })

      test.d = new Observable({
        $key:'d',
        nest: new test.a.$Constructor()
      })

    })
    //now do stuff with d

  })

})

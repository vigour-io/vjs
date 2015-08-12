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
            cnt[key] = cnt[key] ? cnt[key]+1 :1
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
    console.clear()
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
    console.clear()
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

    it( 'should fire once for "d" context' , function() {
      expect( test.cnt.d ).to.equal( 0 )
    })

    test.d = new test.a.$Constructor({
      $key: 'd',
      b:'b'
    })

    it( 'should fire once for "d" context' , function() {
      expect( test.cnt.d ).to.equal( 1 )
    })

    test.a.b.$val = '?'

    it( 'should fire once for "a" context' , function() {
      expect( test.cnt.a ).to.equal( 1 )
    })

    it( 'should fire once for "d" context' , function() {
      expect( test.cnt.d ).to.equal( 1 )
    })

    //now do stuff with d

  })

  describe( 'context and nested instances', function() {
    var test = contextObservable()

    it( 'should create a new a.b (c)', function() {
      test.c = new test.a.b.$Constructor({
        $key:'c'
      })
    })

    test.a.b.$val = 'a change'
    it( 'should fire once for "a" context' , function() {
      expect( test.cnt.a ).to.equal( 1 )
    })
    it( 'should fire once for "b" context' , function() {
      expect( test.cnt.b ).to.equal( 1 )
    })
    it( 'should fire once for "c" instance' , function() {
      expect( test.cnt.c ).to.equal( 1 )
    })
    it( 'should fire 3 times in total' , function() {
      expect( test.cnt.total ).to.equal( 3 )
    })
  })

  //add nog de simpelere test om context + changing contexts van hetzelfde

  describe( 'multiple contexts and different instances', function() {
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

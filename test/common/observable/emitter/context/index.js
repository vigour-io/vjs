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
    test.d = new test.a.$Constructor({
      $key:'d'
    })

    it( 'creates "e" sets b and should fire once for "e" instance' , function() {
      test.d = new test.a.$Constructor({
        $key: 'e',
        b:'b' //you should not fire for original!
      })
      expect( test.cnt.e ).to.equal( 1 )
    })

    it( 'sets a.b and should fire once for "a"' , function() {
      console.clear()
      test.a.b.$val = 'a'
      expect( test.cnt.a ).to.equal( 1 )
    })

    it( 'should fire once for "c"' , function() {
      //problem -- has instances never update contexts anymore
      expect( test.cnt.c ).to.equal( 1 )
    })

    it( 'should fire once for "d"' , function() {
      //problem -- has instances never update contexts anymore
      expect( test.cnt.d ).to.equal( 1 )
    })

    it.skip( 'should not fire for "e"' , function() {
      //TOOD: disconnected cactch irrelevant change
      expect( test.cnt.d ).to.equal( 1 )
    })

  })

  // describe( 'instance with a different parent', function() {
  //   var test = contextObservable()
  //
  //   it( 'should create a new a.b (c) should fire once for c', function() {
  //     test.c = new test.a.b.$Constructor({
  //       $key:'c'
  //     })
  //     expect( test.cnt.c ).to.equal( 1 )
  //   })
  //
  //   it( 'sets a.b, should fire once for "a"' , function() {
  //     test.a.b.$val = 'a change'
  //     expect( test.cnt.a ).to.equal( 1 )
  //   })
  //
  //   it( 'should fire once for "c"' , function() {
  //     expect( test.cnt.c ).to.equal( 2 )
  //   })
  //
  //   it( 'should fire 3 times in total' , function() {
  //     expect( test.cnt.total ).to.equal( 3 )
  //   })
  // })
  //
  // //add nog de simpelere test om context + changing contexts van hetzelfde
  //
  // describe( 'instances with different parents, different contexts', function() {
  //   var test = contextObservable()
  //
  //   if('creates a new "a.b" --> "c" should fire once for "c"', function() {
  //     console.clear()
  //     test.c = new test.a.b.$Constructor({
  //       $key:'c'
  //     })
  //     expect( test.cnt.c ).msg('c').to.equal( 1 )
  //   })
  //
  //   it( 'creates a new "a" --> "d" (nest observable) should fire once for "d"', function() {
  //     test.d = new Observable({
  //       $key:'d',
  //       nest: new test.a.$Constructor() //really mested up case
  //     })
  //     expect( test.cnt.d ).msg('d').to.equal( 1 )
  //   })
  //   //now do stuff with d
  // })

})

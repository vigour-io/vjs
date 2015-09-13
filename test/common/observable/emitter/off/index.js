describe( 'off', function() {

  var Observable = require('../../../../../lib/observable')
  var util = require('../../../../../lib/util')
  var measure = {
    a:{},
    b:{},
    c:{},
    aRef:{},
    bRef:{}
  }
  var aRef
  var bRef
  var a
  var b
  var c
  var ref

  function specialListener() {}
  function weirdListener() {}

  it( 'create new observable --> a, overwrite different types of keys', function() {

     aRef = new Observable({
      $key: 'aRef',
      $val: 'a value for aRef'
     })

     a = new Observable({
      $key: 'a',
      $on: {
        $change: {
          other: function() {},
          special: function() {}
        }
      },
      $val: 1
     })

     a.set({
      $on: {
        $change: {
          special: [ function() {}, aRef ]
        }
      }
     })

     //same for attach and base
     expect( a.$on.$change.$fn.other ).msg('$fn.other').to.be.ok
     expect( a.$on.$change.$fn.special ).msg('$fn.special').to.be.null

     //remove fn if its completely empty
     a.$on.$change.$fn.$removeProperty( a.$on.$change.$fn.other, 'other' )

     expect( a.$on.$change.$fn ).msg('$fn').to.be.null
  })

  it( 'new observable --> a --> b --> c, overwrite listeners, remove listeners', function() {

    ref = new Observable({
      $key:'ref'
    })

    a = new Observable({
      $key: 'a',
      $on: {
        $change: {
          other: function() {},
          special: specialListener,
          attach: [ specialListener ],
          weird: weirdListener
        }
      },
      $val: ref
    })

    b = new a.$Constructor({
      $key: 'b',
      $on: {
        $change: {
          other:function() {}
        }
      }
    })

    expect(b.$on.$change.$fn.special).to.equal( a.$on.$change.$fn.special )
    expect(b.$on.$change.$fn.other).to.not.equal( a.$on.$change.$fn.other )
    expect(b.$on).to.be.an.instanceof( a.$on.$Constructor )

    expect(b.$on.$change.$fn).to.be.an.instanceof( a.$on.$change.$fn.$Constructor )

    a.off( '$change', 'other' )

    expect( b.$on.$change.$fn.other ).to.be.ok
    expect( a.$on.$change.$fn.other ).to.be.null

    c = new b.$Constructor({
      $key:'c'
    })

    c.off( '$change', 'special' )

    expect( b.$on.$change.$fn.special )
      .msg( 'b.$on.$change.$fn.special' ).to.be.ok
    expect( c.$on.$change.$fn.special )
      .msg('c.$on.$change.$fn.special').to.be.null
    expect( c.$on ).to.be.an.instanceof( b.$on.$Constructor )

  })

  it('findAndRemove removals of listeners', function() {
    //removes both attach and fn (all ocurrences)
    b.off( '$change', specialListener )
    expect( a.$on.$change.$fn.special ).to.be.ok
    expect( b.$on.$change.$fn.special ).to.be.null
    expect( a.$on.$change.$attach ).to.be.ok
    expect( b.$on.$change.$attach ).to.be.null

    ref.set({
      $on: {
        $change: [ function(){} , a ]
      }
    })

    expect( ref.$on.$change.$base ).to.be.ok
    expect( ref.$on.$change.$attach ).to.be.ok
    expect( util.isEmpty( a.$listensOnBase ) ).to.be.false
    expect( util.isEmpty( a.$listensOnAttach ) ).to.be.false

    ref.off( '$change', a )
    expect( ref.$on.$change.$base ).to.be.null
    expect( ref.$on.$change.$attach ).to.be.null
    expect( util.isEmpty( a.$listensOnBase ) ).to.be.true
    expect( util.isEmpty( a.$listensOnAttach ) ).to.be.true

    a.off( weirdListener )
    expect( a.$on.$change.$fn.weird ).to.be.null
  })

  it('create new obserable a, findAndRemove removals of listeners with options objects', function() {

    function normal(){}
    function attach(){}

    var aRandomObs = new Observable({
      $key: 'aRandomObs'
    })

    var a = new Observable({
      $key: 'a',
      $on: {
        $change: {
          fn: normal,
          attach: [ normal ],
          base: aRandomObs,
          attach2: [ function(){} , aRandomObs ]
        },
        randomEmitter: {
          fn:normal,
          base: aRandomObs,
          attach: [ normal ]
        }
      }
    })

    a.off({
      $fn: normal,
      $base: aRandomObs
    })

    expect( a.$on.randomEmitter.$fn ).to.be.null
    expect( a.$on.randomEmitter.$base ).to.be.null
    expect( a.$on.$change.$fn ).to.be.null
    expect( a.$on.$change.$base ).to.be.null

    a.off( '$change', {
      $attach: aRandomObs
    })

    expect( a.$on.$change.$attach.attach2 ).to.be.null
    expect( a.$on.$change.$attach.attach ).to.be.ok
    expect( a.$on.randomEmitter.$attach.attach ).to.be.ok

  })

})

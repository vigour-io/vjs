describe('remove', function() {

  var Event = require('../../lib/event')
  Event.prototype.inject( require('../../lib/event/toString' ) )

  var Base = require('../../lib/base')
  Base.prototype.inject( require('../../lib/methods/toString') )

  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')
  var setKeyInternal = Observable.prototype.$setKeyInternal
  var isRemoved = util.isRemoved
  var measure = { 
    a: {} 
  }
  var a
  var b

  it( 'create new observable --> a and remove using method', function() {    
    a = new Observable({
      $key:'a',
      $val:1
    })
    a.remove()
    expect(a._$val).to.be.null;
    expect( isRemoved(a) ).to.be.ok
  })

  it( 'create new observable --> a and remove using a set with null', function() {    
    a = new Observable({
      $key:'a',
      $val:1
    }) 
    a.$val = null  
    expect(a._$val).to.be.null;
    expect( isRemoved(a) ).to.be.ok
  })

  it( 'create new observable --> a and remove field "prop1"', function() {    
    var cntKeySets = 0
    a = new Observable({
      $key:'a',
      $on:{}, //defines that we are interested in instances
      prop1:{
        $define:{
          $setKeyInternal:function() {
            cntKeySets++
            return setKeyInternal.apply(this, arguments)
          }
        }
      },
      prop2:true,
      prop3:true,
      prop4:true,
      prop5: {
        prop6: true
      },
      prop7: {
        prop8: {
          prop9: {
            prop10:true
          }
        }
      },
      prop11: {
        prop12: true
      }
    }) 

    a.prop1.$set({
      firstProperty:true,
      $val:null,
      notImportant:true,
      notImportant2:true
    })

    //using a set this should result in 1 key call (no more sets after remove)
    expect(cntKeySets).to.equal(1)
    expect(a.prop1).to.be.null
  })

  it( 'new a --> b, handle instances and nested fields ', function() {
   
    console.clear()

    b = new a.$Constructor({
      $key:'b',
      prop4:null
    })

    expect( a.prop4 ).msg('prop4 in a').to.be.ok
    expect( b.prop4 ).msg('prop4 in b').to.be.null
    
    b.prop2.remove()
    expect(a).to.have.property( 'prop2' )
    expect(a.prop2).msg('a.prop2').to.be.ok
    expect(b.prop2).msg('b.prop2').to.be.null

    expect(isRemoved(b)).msg('check if b is not removed').to.be.false

    b.prop3.$clearContext().remove()

    expect(a.prop3).msg('a.prop3').to.be.null
    expect(b.prop3).msg('b.prop3').to.be.null

    expect(isRemoved(b))
      .msg('check if b still exists after instances removal of "prop3"')
      .to.be.false

    a.$set({ prop4: null })
    a.$set({ prop4: true })
   
    expect( a.prop4 ).msg('prop4 in a (reset)').to.be.ok
    expect( b.prop4 ).msg('prop4 in b (reset)').to.be.null

    b.prop5.prop6.remove()
    expect( a.prop5.prop6 ).msg('a.prop5.prop6').to.be.ok
    expect( b.prop5.prop6 ).msg('b.prop5.prop6').to.be.null

    b.prop7.prop8.prop9.remove()
    expect( a.prop7.prop8.prop9.prop10 )
      .msg('a.prop7.prop8.prop9.prop10').to.be.ok
    expect( b.prop7.prop8.prop9)
      .msg('a.prop7.prop8.prop9').to.be.null

    //this test has to go to '.$set' test
    b.prop11.prop12.$set({
      prop13:true
    })

    expect( b.prop11.prop12 )
      .msg('b.prop11.prop12').to.have.property('prop13')

    expect( a.prop11.prop12 )
      .msg('a.prop11.prop12').to.not.have.property('prop13')

  })

  it( 'add change listener to a and remove a', function() {   

    measure.a.val = {
      total: 0,
      removed: 0
    }

    //since we defined before that we want $on:{} (we are inteserted in instances)
    //it will handle instances accordingly

    //think about unifiying this system since it maye be super important for hub 
    //(context)

    a.$set({
      $on: {
        $change:{
          $val: function( event, meta ) {
            var keyCnt =  measure.a.val[this._$key] 
            //second time is null should be b else things become very unclear
            measure.a.val[this._$key] = keyCnt ? (keyCnt+1) : 1 
            measure.a.val.total++
            if( meta === true ) {
              measure.a.val.removed++
            }
          }
        }
      }
    }) 

    var changeEmitter = a.$on.$change
    var fn = changeEmitter.$fn

    expect(fn).to.have.property( 'val' )

    a.$val = null

    expect(isRemoved(changeEmitter))
      .msg('check if changeEmitter is removed').to.be.true
     expect(isRemoved(fn))
      .msg('check if fn is removed').to.be.true


    expect( measure.a.val.a ).msg('a val change context:a').to.equal(1)
    expect( measure.a.val.b ).msg('a val change context:b').to.equal(1)
    expect( measure.a.val.total ).to.equal(2)

    expect(isRemoved(a)).msg('check if a is removed').to.be.true
    expect(isRemoved(b)).msg('check if b is removed').to.be.true

    //!!!this really has to be fixed!!!
    //maybe just make a remove listener
    // expect( measure.a.val.removed ).msg('correct removed (meta) count').to.equal(2)

  })

  it( 'create new observable --> a --> b, add ref - change listener, remove listener, test listens and removal', function() {

    var reffed = new Observable({
      $key:'reffed'
    })

    var reffed2 = new Observable({
      $key:'reffed2'
    })

    a = new Observable({
      $key:'a',
      $val: reffed
    }) 

    reffed2.on( '$change', a )

    b = new a.$Constructor({ 
      $key:'b' 
    })
    
    var cnt = 0
    a.$listensOnBase.each(function() {
      cnt++
    })

    expect( cnt ).msg('listensOn in a').to.equal(2)

    reffed.remove()
   
    cnt = 0
    a.$listensOnBase.each(function() {
      cnt++
    })

    expect( cnt ).msg('listensOn in a (after remove)').to.equal(1)

    a.remove()

    cnt = 0
    reffed2.$on.$change.$base.each(function() {
      cnt++
    })

    expect( cnt ).msg('base listeners on reffed 2 (listens on reffed)').to.equal(0)

  })

  it( 'create new observable --> a --> b, add passon - change listener, remove listener, test listens and removal', function() {

    var reffed = new Observable({
      $key:'reffed'
    })

    var reffed2 = new Observable({
      $key:'reffed2'
    })

    a = new Observable({
      $key:'a'
    }) 

    reffed.on( '$change', [ function(){}, a ])
    reffed2.on( '$change', [ function(){}, a ])

    b = new a.$Constructor({ $key:'b' })
    
    var cnt = 0
    a.$listensOnPasson.each(function() {
      cnt++
    })

    expect( cnt ).msg('listensOn in a').to.equal(2)

    reffed.remove()
   
    cnt = 0
    a.$listensOnPasson.each(function( property ) {
      cnt++
    })

    expect( cnt )
      .msg('listensOn in a (after remove)').to.equal(1)

    a.remove()

    cnt = 0
    reffed2.$on.$change.$passon.each(function() {
      cnt++
    })

    expect( cnt )
      .msg('base listeners on reffed 2 (listens on reffed)').to.equal(0)

  })

  it('create new observable --> a --> b remove listeners from b', function() {
    // console.clear()

    measure.a.val = {
      total: 0
    }
    
    a = new Observable({
      $key:'a',
      $on: {
        $change:function() {
          measure.a.val.total++
          console.log('lets change from a context:', this.$path)
        }
      }
    }) 

    b = new a.$Constructor({ 
      $key:'b'
    })

    console.error('\n\n\n\n')

    //no event since it on base (emitters are base...)
    b.$on.$change.remove()

    a.$set({
      prop1:true
    })

    expect( a.$on.$change ).to.be.ok
    expect( b.$on.$change ).to.be.null

    console.clear()


    b.$on.remove()    
    expect( a.$on ).to.be.ok
    expect( b.$on ).to.be.null

    var foundb
    for( var key$ in a.$on._instances ) {
      if( a.$on._instances[key$] === b ) {
        foundb = true
      }
    }

    expect( foundb ).msg('removed b from instances (removed $on on b').to.not.be.ok

    // add test to remove _instances completely
    // this is different since this requires you to remove $on

    expect( measure.a.val.total ).to.equal(2)

    b.$on.$change.remove()


  })

})


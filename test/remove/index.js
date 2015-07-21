describe('remove', function() {

  var Event = window.xxx = require('../../lib/event')
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
      prop3:true
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
   
    b = new a.$Constructor({
      $key:'b'
    })
    
    b.prop2.remove()
    expect(a).to.have.property( 'prop2' )
    expect(b.prop2).to.be.null

    expect(isRemoved(b)).msg('check if b is not removed').to.be.false

    b.prop3.$clearContext().remove()

    expect(a.prop3).to.be.null
    expect(b.prop3).to.be.null

    expect(isRemoved(b))
      .msg('check if b still exists after instances removal of "prop3"')
      .to.be.false

  })

  // it( 'add change listener to a and remove a', function() {   

  //   measure.a.val = {
  //     total: 0,
  //     removed: 0
  //   }

  //   a.$set({
  //     $on: {
  //       $change:function( event, meta ) {
  //         var keyCnt =  measure.a.val[this._$key] 
  //         console.error(this._$key, event.toString())
  //         //second time is null should be b else things become very unclear
  //         measure.a.val[this._$key] = keyCnt ? (keyCnt+1) : 1 
  //         measure.a.val.total++

  //         if( meta === true ) {
  //           measure.a.val.removed++
  //         }

  //       }
  //     }
  //   }) 

  //   console.log('set to null', a.$on._instances)
  //   a.$val = 'blaxxx'

  //   // expect( measure.a.val.removed ).to.equal(2)
  //   expect( measure.a.val.a ).msg('a val change context:a').to.equal(1)
  //   expect( measure.a.val.b ).msg('a val change context:b').to.equal(1)
  //   expect( measure.a.val.total ).to.equal(2)

  // })

})

//instances
//listeners
//removeListener 

  // it( 'add change listener and remove listener', function() {

  //   a.$set({
  //     $on: {
  //       $change:function( event, meta ) {
  //         //random change method
  //       }
  //     }
  //   }) 

  //   //removed 'val'
  //   // a.removeListener( '$change', 'val' )

  //   //removeListener accepts 

  // })

describe('remove', function() {

  var Base = require('../../lib/base')
  Base.prototype.inject(require('../../lib/methods/toString'))
  var Observable = require('../../lib/observable')
  var util = require('../../lib/util')
  var setKeyInternal = Observable.prototype.$setKeyInternal
  var measure = { 
    a: {} 
  }
  var a

  it( 'create new observable --> a and remove using method', function() {    
    a = new Observable({
      $key:'a',
      $val:1
    })
    a.remove()
    expect(a._$val).to.be.null;
    expect(a).to.have.all.keys(['_$val']);
  })

  it( 'create new observable --> a and remove using a set with null', function() {    
    a = new Observable({
      $key:'a',
      $val:1
    }) 
    a.$val = null  
    expect(a._$val).to.be.null;
    expect(a).to.have.all.keys(['_$val']);
  })

  it( 'create new observable --> a and remove field prop1', function() {    
    var cntKeySets = 0
    a = new Observable({
      $key:'a',
      prop1:{
        $define:{
          $setKeyInternal:function() {
            cntKeySets++
            return setKeyInternal.apply(this, arguments)
          }
        }
      },
      prop2:true
    }) 

    a.prop1.$set({
      firstProperty:true,
      $val:null,
      notImportant:true,
      notImportant2:true
    })

    //using a set this should result in 1 key call (no more sets after remove)
    expect(cntKeySets).to.equal(1)

    expect(a.prop1).to.be.an('undefined');
  })

  it( 'add change listener to a and remove a', function() {   

    measure.a.val = {
      total: 0
    }

    a.$set({
      $on: {
        $change:function( event, meta ) {
          measure.a.val.total++
        }
      }
    }) 

    a.$val = null

    expect( measure.a.val.total ).to.equal(1)

  })

})
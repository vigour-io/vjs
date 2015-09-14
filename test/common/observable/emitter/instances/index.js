describe('instances', function() {

  var Observable = require('../../../../../lib/observable')
  var measure = {
    a:{},
    b:{},
    c:{},
    a2:{},
    b2:{},
    a3:{},
    b3:{}
  }
  var a
  var b
  var c
  var a2
  var b2
  var a3
  var b3

  it( 'create new observable --> a, add change listener "val"', function() {
    measure.a.val = { total: 0 }
    a = new Observable({
      $key:'a',
      $on: {
        $change: function( event, meta ) {
          var keyCnt =  measure.a.val[this.$key]
          measure.a.val.total+=1
          measure.a.val[this.$key] = keyCnt ? (keyCnt+1) : 1
        }
      }
    })
    expect( measure.a.val.total ).to.equal( 0 )
    a.$val = 'a value'
    expect( measure.a.val.a ).to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 1 )
  })

  it( 'create new a --> b', function() {
    b = new a.$Constructor({
      $key:'b',
      // $val:true
    })

    expect( a._$instances.length )
      .msg('a._$instances has correct length').to.equal(1)
    expect( a._$instances[0] )
      .msg('b is a._$instances.total').to.equal(b)

    expect( measure.a.val.b ).to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 2 )
  })

  it( 'change a', function() {
    a.$val = 'a change'
    expect( measure.a.val.a ).msg('a context').to.equal( 2 )
    expect( measure.a.val.b ).msg('b context').to.equal( 2 )
    expect( measure.a.val.total ).to.equal( 4 )
  })

  it( 'create new b --> c', function() {
    c = new b.$Constructor({
      $key:'c'
    })
    expect( measure.a.val.a ).msg('a context').to.equal( 2 )
    expect( measure.a.val.b ).msg('b context').to.equal( 2 )
    expect( measure.a.val.c ).msg('c context').to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 5 )
  })

  it( 'change a', function() {
    a.$val = 'a changes again'
    expect( measure.a.val.a ).msg('a context').to.equal( 3 )
    expect( measure.a.val.b ).msg('b context').to.equal( 3 )
    expect( measure.a.val.c ).msg('c context').to.equal( 2 )
    expect( measure.a.val.total ).to.equal( 8 )
  })

  it( 'change b, add property "prop1"', function() {
    b.$val = {
      prop1:true
    }
    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 3 )
    expect( measure.a.val.b ).msg('b context').to.equal( 4 )
    expect( measure.a.val.c ).msg('c context').to.equal( 3 )
    expect( measure.a.val.total ).to.equal( 10 )
  })

  it( 'add change listener "second" on b', function() {
    measure.b.second = { total: 0 }
    b.$val = {
      $on: {
        $change: {
          second: function() {
            var keyCnt =  measure.b.second[this.$key]
            measure.b.second.total+=1
            measure.b.second[this.$key] = keyCnt ? (keyCnt+1) : 1
          }
        }
      }
    }

    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 3 )
    //updates since it has to create its own property .$on for b (and c)
    //hard part here is that it has to resolve instances of b (from the instances of a)
    expect( measure.a.val.b ).msg('b context').to.equal( 5 )
    expect( measure.a.val.c ).msg('c context').to.equal( 4 )
    expect( measure.a.val.total ).to.equal( 12 )

    expect( measure.b.second.total ).to.equal( 0 )

  })

  it( 'change a', function() {
    a.$val = 'again a change!'
    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 4 )
    expect( measure.a.val.b ).msg('b context').to.equal( 6 )
    expect( measure.a.val.c ).msg('c context').to.equal( 5 )
    expect( measure.a.val.total ).to.equal( 15 )

    expect( measure.b.second.c ).msg('c context (b second)').to.equal( 1 )
    expect( measure.b.second.b ).msg('b context (b second)').to.equal( 1 )
    expect( measure.b.second.total ).to.equal( 2 )
  })

  it( 'change b, add property "prop2"', function() {
    b.$val = {
      prop2:true
    }
    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 4 )
    expect( measure.a.val.b ).msg('b context').to.equal( 7 )
    expect( measure.a.val.c ).msg('c context').to.equal( 6 )
    expect( measure.a.val.total ).to.equal( 17 )

    expect( measure.b.second.c ).msg('c context (b second)').to.equal( 2 )
    expect( measure.b.second.b ).msg('b context (b second)').to.equal( 2 )
    expect( measure.b.second.total ).to.equal( 4 )
  })

  it( 'create new c --> d', function() {
    d = new c.$Constructor({
      $key:'d'
    })
    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 4 )
    expect( measure.a.val.b ).msg('b context').to.equal( 7 )
    expect( measure.a.val.c ).msg('c context').to.equal( 6 )
    expect( measure.a.val.d ).msg('d context').to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 18 )

    expect( measure.b.second.d ).msg('d context (b second)').to.equal( 1 )
    expect( measure.b.second.total ).to.equal( 5 )
  })

  it( 'overwrite change listener "val" on c', function() {

    measure.c.val = { total: 0 }

    c.$val = {
      $on: {
        $change:function( event, meta ) {
          var keyCnt =  measure.c.val[this.$key]
          measure.c.val.total+=1
          measure.c.val[this.$key] = keyCnt ? (keyCnt+1) : 1
        }
      }
    }

    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 4 )
    expect( measure.a.val.b ).msg('b context').to.equal( 7 )
    expect( measure.a.val.c ).msg('c context').to.equal( 6 )
    expect( measure.a.val.d ).msg('d context').to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 18 )

    expect( measure.b.second.c ).msg('c context (b second)').to.equal( 3 )
    expect( measure.b.second.d ).msg('d context (b second)').to.equal( 2 )

    expect( measure.b.second.total ).to.equal( 7 )

    //this is still wrong
    // expect( measure.c.val.d ).msg('d context (c val)').to.equal( 0 )

  })

  it( 'change c', function() {
    c.$val = 'i am changing value to c'

    //no update on a (since its out of the context of a)
    expect( measure.a.val.a ).msg('a context').to.equal( 4 )
    expect( measure.a.val.b ).msg('b context').to.equal( 7 )
    expect( measure.a.val.c ).msg('c context').to.equal( 6 )
    expect( measure.a.val.d ).msg('d context').to.equal( 1 )
    expect( measure.a.val.total ).to.equal( 18 )

    expect( measure.c.val.c ).msg('c context (c val)').to.equal( 1 )
    expect( measure.c.val.d ).msg('d context (c val)').to.equal( 1 )
    expect( measure.c.val.total ).to.equal( 2 )

    expect( measure.b.second.c ).msg('c context (b second)').to.equal( 4 )
    expect( measure.b.second.d ).msg('d context (b second)').to.equal( 3 )
    expect( measure.b.second.total ).to.equal( 9 )

  })

  it( 'add change attach listener "attach" on c', function() {

    measure.c.attach = { total: 0 }

    var attachTest = new Observable({
      $key:'attachTest'
    })

    c.$val = {
      $on: {
        $change:{
          attach: [
            function( event, meta, base, arg ) {
              var keyCnt =  measure.c.attach[this.$key]
              measure.c.attach.total+=1
              measure.c.attach[this.$key] = keyCnt ? (keyCnt+1) : 1
            },
            attachTest,
            'an argument!'
          ]
        }
      }
    }

    expect( measure.c.val.c ).msg('c context (c val)').to.equal( 1 )
    expect( measure.c.val.d ).msg('d context (c val)').to.equal( 1 )
    expect( measure.c.val.total ).to.equal( 2 )

    expect( measure.b.second.c ).msg('c context (b second)').to.equal( 4 )
    expect( measure.b.second.d ).msg('d context (b second)').to.equal( 3 )
    expect( measure.b.second.total ).to.equal( 9 )

    expect( measure.c.attach.total ).to.equal( 0 )

  })

  it( 'change c', function() {
    c.$val = 'i am changing value again'

    expect( measure.c.val.c ).msg('c context (c val)').to.equal( 2 )
    expect( measure.c.val.d ).msg('d context (c val)').to.equal( 2 )
    expect( measure.c.val.total ).to.equal( 4 )

    expect( measure.b.second.c ).msg('c context (b second)').to.equal( 5 )
    expect( measure.b.second.d ).msg('d context (b second)').to.equal( 4 )
    expect( measure.b.second.total ).to.equal( 11 )

    expect( measure.c.attach.c ).msg('c context (c attach)').to.equal( 1 )
    expect( measure.c.attach.d ).msg('d context (c attach)').to.equal( 1 )
    expect( measure.c.attach.total ).to.equal( 2 )

  })

  it( 'create new observable --> a2 --> b2, add listener on a2', function() {

    //this part of the flow is very confusing
    //reason why b2 does not update is that we dont want to store _instances for eveything
    //if you want this behaviour add an empty object for $on

    measure.a2.val = {
      total: 0
    }

    a2 = new Observable({
      $key:'a2'
    })

    b2 = new a2.$Constructor({
      $key:'b2'
    })

    a2.set({
      $on: {
        $change:function( event, meta ) {
          var keyCnt =  measure.a.val[this.$key]
          measure.a.val.total+=1
          measure.a.val[this.$key] = keyCnt ? (keyCnt+1) : 1
        }
      }
    })

    expect( a2.$on ).to.not.have.property( '_instances' )

  })

  it( 'create new observable --> a3 --> b3, add listener on a3 (empty $on first)', function() {

    measure.a3.val = {
      total: 0
    }

    a3 = new Observable({
      $key:'a2',
      //this defines that we are interested in instances and may update on later
      $on:{}
      //note this is pretty slow now (optmize later since element will have this construction)
    })

    b3 = new a3.$Constructor({
      $key:'b2'
    })

    a3.set({
      $on: {
        $change:function( event, meta ) {
          var keyCnt =  measure.a.val[this.$key]
          measure.a.val.total+=1
          measure.a.val[this.$key] = keyCnt ? (keyCnt+1) : 1
        }
      }
    })

    expect( a3._$instances.length )
      .msg('a3.$on._instances has correct length').to.equal(1)
    expect( a3._$instances[0] )
      .msg('b3 is a3.$on._instances.total').to.equal(b3)
  })

  describe( 'set on instance nested field', function() {
    // console.clear()
    var cnt = 0

    var a = new Observable({
      $key:'a',
      $trackInstances:true,
      b: {
        c: {
          $on: {
            $change:function() {
              // console.log('fire it?', this._$path)
              cnt++
            }
          }
        }
      }
    })

    var aInstance

    it('listener fires once', function() {
      aInstance = new a.$Constructor({
        $key:'aInstance'
      })
      expect(cnt).to.equal(0)
    })

    it('listener fired 2 times', function() {
      a.b.set({
        c: true
      })
      expect(cnt).to.equal(2)
    })

    it('listener fired 3 times', function() {
      // console.clear()
      aInstance.b.set({
        c: '?'
      })
      //we are now doing resolving of context!
      expect(cnt).to.equal(3)
    })

  })

})

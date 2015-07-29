describe('operator', function() {

  var Event = require('../../../lib/event')
  Event.prototype.inject( require('../../../lib/event/toString' ) )

  var Base = require('../../../lib/base')
  Base.prototype.inject( require('../../../lib/methods/toString') )

  var Observable = require('../../../lib/observable')
  Observable.prototype.inject(
    require('../../../lib/operator/add')
  )

  var Operator = require('../../../lib/operator')

  Observable.prototype.$flags = {
    $concat: new Operator({
      $key:'$concat',
      $operator:function( val ) { 
        return val + " it works!"
      }
    })
  }

  var util = require('../../../lib/util')

  var a
  var b
  var c

  var measure = {
    c: {}
  }

  it( 'Operators fire change on parents', function( done ) {    

    measure.c = {
      val: {
        total: 0
      }
    }

    a = new Observable({
      $key:'a',
      $val:1
    })

    b = new Observable({
      $key:'b',
      $val:1
    })

    c = new Observable({
      $val: a,
      $add: b,
      $on: {
        $change:function() {
          measure.c.val.total++
        }
      }
    })

    a.$val = 'x'
    b.$val = 'y'

    expect(measure.c.val.total).to.equal(2)

    done()

    // expect(
    //   function() {
    //     var arr = []
    //     for(var i = 0 ; i < 10000000; i++) {
    //       // arr.push(i)
    //     }
    //   }
    // ).msg('number')
    //   .performance( 100 )


      //args example

    // expect( function() {
    //   for(var i = 10000000000 ; i > 0; i--) {
    //   }
    // }).msg('method compare').to.performance( function() {
    //   for(var i = 10000000000 ; i > 0; i--) {
    //   }
    // }, done )

  })
 
  it ( 'Working with a custom operator', function(done){
    var a = new Observable({
      $val: "Yes",
      $concat: true
    })

    expect(a.$val).to.equal("Yes it works!")
    done()

  })

  it ( 'Changing the parent should update the child', function(done){
    var b = new Observable({
      $val: "Yes",
      $concat: true
    })
    b.$val = "Sure"

    expect(b.$val).to.equal("Sure it works!")
    done()

  })

  it ( 'Should not call the operator function if its not been used', function(done){
    var c = new Observable({
      $val: "Yes"
    })

    expect(c.$val).to.equal("Yes")
    done()

  }) 
})


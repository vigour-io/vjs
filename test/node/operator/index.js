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
  })

  it( 'first set on operator, fires change on parent', function( done ) {    

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
      $on: {
        $change:function() {
          measure.c.val.total++
        }
      }
    })

    d = new c.$Constructor({
      $val: a,
      $add: b
    })

    expect(measure.c.val.total).to.equal(2)

    done()
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


describe('operator', function() {

  console.clear()

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

  it( 'Operators fire change on parents', function() {

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
          measure.c.val.total = measure.c.val.total+1
        }
      }
    })
    a.$val = 'x'
    b.$val = 'y'
    expect(measure.c.val.total).to.equal(2)
  })

  it( 'first set on operator, fires change on parent', function() {

    measure.c = {
      val: {
        total: 0
      }
    }

    a = new Observable({
      $key: 'a',
      $val: 1
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

    expect(measure.c.val.total).to.equal(1)

    var ftotal = 0
    var F = new Observable({
        $on: {
          $change: function() {
            ftotal++
          }
        }
    }).$Constructor

    var e = new Observable({
      bla: new F({
        $val: 1,
        $add: 2
      })
    })

    expect( ftotal ).msg('ftotal').to.equal( 1 )

  })

  it ( 'Working with a custom operator', function(){
    var a = new Observable({
      $val: "Yes",
      $concat: true
    })
    expect(a.$val).to.equal("Yes it works!")
  })

  it ( 'Changing the parent should update the child', function(){
    var b = new Observable({
      $val: "Yes",
      $concat: true
    })
    b.$val = "Sure"
    expect(b.$val).to.equal("Sure it works!")
  })

  it ( 'Should not call the operator function if its not been used', function(){
    var c = new Observable({
      $val: "Yes"
    })
    expect(c.$val).to.equal("Yes")
  })
})

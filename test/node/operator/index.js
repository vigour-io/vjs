describe('operator', function() {

  var Event = require('../../../lib/event')
  Event.prototype.inject( require('../../../lib/event/toString' ) )

  var Base = require('../../../lib/base')
  Base.prototype.inject( require('../../../lib/methods/toString') )

  var Observable = require('../../../lib/observable')
  Observable.prototype.inject(
    require('../../../lib/operator/add')
  )

  var util = require('../../../lib/util')

  var a
  var b
  var c

  var measure = {
    c: {}
  }

  it( 'operators fire change on parents', function( done ) {    

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

})


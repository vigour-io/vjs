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

})


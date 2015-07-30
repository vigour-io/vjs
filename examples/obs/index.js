describe('super test for observebles', function() {

  var Observable = require('../../lib/observable')

  Observable.prototype.inject(
    require('../../lib/operator/add'),
    require('../../lib/operator/prepend'),
    require('../../lib/operator/transform')
  )

  var Event = require('../../lib/event')
  Event.prototype.inject( require('../../lib/event/toString') )

  it('should fire when i change a vaiue', function() {

    var a = new Observable({$key:'a'})

    var c = new Observable({
      $key: 'c',
      $val: ' rvererg',
      $on: {
        $change: function( event ) {
          console.log( 'IM A LISTENER ON C', event.toString() )
        
          b.set({x:true}, event)
        }
      }
    })

    var b = new Observable({
      $key:'b',
      $val: a,
      $add: c,
      $transform: function(cv) {
        return typeof cv === 'string' ? cv.toUpperCase() : '*'
      },
      $on: {
        $change:function( event ) {
          console.log('fire listener on b!', this.$val, event.toString() )
          c.set({
            $val:Math.random()*9999
          }, event)
        }
      }
    })

    a.$val = 'xxxx'

    // a.$val = 'yyyy'

    // a.$val = 100




    //a.on('$change', funciton() {})
    //a.on('$property', funciton() {})
    //a.on('$value', funciton() {})
    //b.on('$reference', funciton() {})


  })



//a.on('$new', funciton() {})





})
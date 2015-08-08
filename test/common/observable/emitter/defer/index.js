describe('defer', function() {

  console.clear()
  var Observable = require('../../../../../lib/observable')


  it('should create a new event and fire with a timeout', function() {

    var a = new Observable({
      $key:'a', //this will just set $key
      $on: {
        $change: {
          $val: function() {
            console.log('???')
          },
          // defer can be an object or function
          $defer: {
            $val: function( emit, cancel ) {
              this._$timeout = setTimeout( emit, 200 )
            },
            $cancel: function() { //add this a default flag on base?
              //this is context of the defer
              clearTimeout( this._$timeout )
            }
          }
        }
      }
    })

    a.$val = 'hello'


  })

})

console.clear()

// var http = require('http')
//
// http.request('http://vigour.io', function( err, res ) {
//   console.log('?', res, err )
// }).end()

describe('defer', function() {

  var Observable = require('../../../../../lib/observable')

  it( 'fire with a timeout of 200ms', function(done) {

    var a = new Observable({
      $key:'a', //this will just set $key
      $on: {
        $change: {
          $val: function() {
            done()
          },
          // defer can be an object or function
          $defer: {
            $val: function( emit ) {
              setTimeout( emit, 200 )
            }
          }
        }
      }
    })

    a.$val = 'hello'

  })

  it( 'remove defer', function( done ) {
    var cnt = 0
    var a = new Observable({
      $key:'a', //this will just set $key
      $on: {
        $change: {
          $val: function() {
            cnt++
          },
          // defer can be an object or function
          $defer: {
            $val: function( emit, event, defer ) {
              defer._$timeout = setTimeout( emit, 200 )
            },
            $cancel: function( event, defer ) { //add this a default flag on base?
              clearTimeout( defer._$timeout )
            }
          }
        }
      }
    })

    a.$val = 'hello'

    a.remove()

    setTimeout(function() {
      expect(cnt).to.equal(0)
      done()
    }, 400)

  })

})

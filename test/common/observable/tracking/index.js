console.clear()

var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')

describe('value change emitter', function() {
  console.log('hello111')

  var a = new Observable({
    $inject: tracking,
    $on: {
      //random emitter
      rick: function( event, meta ) {
        console.error('rick is firing')
      }
    },
    $track: true, //should listen for listeners as well
  })

  a.$val = 'rick'
  a.$val = 'james'

  a.emit('rick')




})

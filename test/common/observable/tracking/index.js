// console.clear()

var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/tracking/')
var trackerEmitter = require('../../../../lib/tracking/emitter')

trackerEmitter.$plugins.rick = function() {
  console.log('omg rick plugin')
}

describe('value change emitter', function() {
  // Observable.prototype.inject( tracking )
  var a = new Observable({
    $inject: tracking,
    $on: {
      //random emitter
      rick: function( event, meta ) {
        console.error('rick is firing')
      },
      // $value, $remove, $error, $reference, $property, $change, $new, $addToParent, $
    },
    $track: true, //should listen for listeners as well
  })
  a.$val = 'rick'
  a.$val = 'james'
  a.emit('rick')
})

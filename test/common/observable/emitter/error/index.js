var Observable = require('../../../../../lib/observable/')
var ErrorEmitter = require('../../../../../lib/emitter/error')

console.clear()
describe('value change emitter', function() {

  var rick = {
    randomthings:true
  } //new Object()

  rick.james = 'xxxxx'

  var aErrorEmitter = new ErrorEmitter()
  aErrorEmitter.on(function( event, error ) {
    console.error('omg error', error )
  })
  aErrorEmitter.emit( false,false,false, new Error('rick error'))

  var obs = new Observable({
    $key:'obs',
    $trackInstances:true,
    rick: {
      james: {
        $on: {
          flap:{
            james: function() {
          
            },
            rick:function() {
          
            }
          },
          $error: function( event, error ) {
            console.error( error )
          }
        }
      }
    }
  })

  var obsInstance = new obs.$Constructor({
    $key:'?'
  })

  obs.rick.james.emit('$error')
  obs.rick.james.emit('flap')
  for(var i in rick) {

  }


})

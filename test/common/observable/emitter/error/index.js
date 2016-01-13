'use strict'
var Observable = require('../../../../../lib/observable/')
var ErrorEmitter = require('../../../../../lib/emitter/error')

describe('error emitter', function () {
  var aErrorEmitter = new ErrorEmitter()
  // aErrorEmitter.emit(false, false, false, new Error('rick error'))

  var obs = new Observable({
    key: 'obs',
    trackInstances: true,
    rick: {
      james: {
        on: {
          error: function ( data, event ) {
            console.error('yo error', data, event)
          }
        }
      }
    }
  })

  var obsInstance = new obs.Constructor({
    key: '?'
  })

  obs.rick.james.emit('error')

})

var log = require('../../dev/log')
var perf = require('../../dev/perf')
//-----------------------------------------------------

var Base = require('../../lib/base')
Base.prototype.inject( require('../../lib/methods/toString') )

var Observable = require('../../lib/observable')

Observable.prototype.inject( 
  require('../../lib/operator/add'),
  require('../../lib/operator/filter'),
  require('../../lib/operator/map'),
  require('../../lib/operator/multiply')
)

var obs = new Observable({
  $key:'obs',
  $on: {
    $change: function( event, meta ) {
      //why does getting $key not work?
      log( 'fire obs event', this.$path )
    },
    $property: function( event, meta ) {
      log('fire prop:', JSON.stringify(meta), this.$path)
    }
  }
})

obs.$set({
  x:true
})

var bla = new obs.$Constructor({
  $key:'bla',
  marcus:'besjes',
  $on: {
    $change: {
      mups: function( event, meta ) {
        log('wtf wtf wtf', event)
      }
    }
  }
})

log('------')


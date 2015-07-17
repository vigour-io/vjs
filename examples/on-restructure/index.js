var log = require('../../dev/log')
var perf = require('../../dev/perf')
//-----------------------------------------------------

var Base = require('../../lib/base')

Base.prototype.inject( require('../../lib/methods/toString') )
//wil eigenlijk ook op constructors kunnen injecten

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
      log( 'val change listener (from obs)', this.$path, event )
    },
    $property: function( event, meta ) {
      log('val property listener (from obs)', JSON.stringify(meta), this.$path)
    }
  }
})

log('--- now log change and property ------')

obs.$set({
  x:true
})

log('--- new instance - now log val (from obs) listener and property (from obs)------')

var bla = new obs.$Constructor({
  $key:'bla',
  marcus:'besjes',
  $on: {
    $change: {
      speshField: function( event, meta ) {
        log('speshField change listener (from bla)', event)
      }
    }
  }
})
//why does property fire and not the other?

log('------')


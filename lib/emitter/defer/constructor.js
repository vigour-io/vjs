"use strict";
var Base = require( '../../base' )
var set = Base.prototype.set
var remove = Base.prototype.remove
var exec = require( '../exec/method.js' )
var Event = require( '../../event' )

var isIncluded = function( arr, bind, event ) {
  for( var i in arr ) {
    var item = arr[i]
    var stamp = item.event.$stamp
    var inherits
    if( item.bind === bind
      && stamp === event.$stamp
        || ( inherits = event.$inherits )
          && inherits.$stamp === stamp
      ) {
      return true
    }
  }
}

Event.prototype.inject( require( '../../event/toString.js' ) )

module.exports = new Base( {
  $key: '$defer',
  $flags: {
    cancel: function( val ) {
      this._cancel = val
    }
  },
  $define: {
    remove: function() {
      if( this.$inProgress ) {
        this.cancel( true )
      }
      return remove.apply( this, arguments )
    },
    set: function() {
      return set.apply( this, arguments )
    },
    cancel: function( forAllInstances ) {

      var emitter = this._$parent
      var observable = emitter.$parent.$parent
      var inProgress = this.$inProgress
      var length = inProgress.length
      var cancel = this._cancel
      var i = length - 1
      var bind
      var item

      var iShouldCancel = forAllInstances
        ? function( bind ){
            return bind instanceof observable.$Constructor || observable === bind
          }
        : function( bind ){
            return observable === bind
          }

      for (; i >= 0; i--) {
        item = inProgress[i]
        bind = item.bind
        if( iShouldCancel( bind ) ){
          if( cancel ) {
            cancel.call( bind, item.event, this )
          }
          inProgress.splice(i,1)
          length--
        }
      }


      if(!length){
        
        this.$inProgress = null

        emitter.$isPostponed = null
        emitter._$emitting = null
        emitter._$meta = null
        
      }

    },
    $exec: function( event ) {
      // console.error('hey exec!', event.toString(), this._$parent.$lastStamp)
      var emitter = this._$parent
      var stamp = event.$stamp
      var inProgress
      var $binds
      var binds

      if( emitter.$lastStamp !== stamp ) {
        if( inProgress = this.$inProgress ){
          for (var i = inProgress.length - 1; i >= 0; i--) {
            var item = inProgress[i]
            if( event.$deferred !== item ){
              this.cancel()
            }
          }
        }

        $binds = this._$parent.$binds
        if( binds = $binds && $binds[ event.$stamp ] ) {
          for( var i = 0, length = binds.length; i < length; i++ ) {
            this.$execInternal( binds[ i ], event )
          }
        }
        emitter.$lastStamp = stamp
      }
    },
    $execInternal: function( bind, event ) {
      var emitter = this._$parent
      var inProgress = this.$inProgress

      if( !inProgress ) {
        inProgress = this.$inProgress = []
      } else if( isIncluded( inProgress, bind, event ) ) {
        return
      }

      var origin = event.$origin
      var defer = this
      var oldevent

      var progress = {
        bind: bind,
        event: event
      }
      
      inProgress.push( progress )

      if( this._$val ) {
        //how to exec emitter????
        //dont do this for every instances -- they can share -- find origin
        oldevent = event
        event = new Event( bind, event.$type )
        event.$inherits = oldevent
        event.$deferred = progress
        event.$origin = bind

        var ret = this._$val.call( bind, function execEmitter() {
          var inProgress = defer.$inProgress
          if( inProgress ) {
            
            var length = inProgress.length
            var i = length - 1

            for( ; i >= 0; i-- ) {
              if( inProgress[ i ] === progress ) {
                inProgress.splice( i, 1 )
                length--
              }
            }
            if( !length ) {
              defer.$inProgress = null
            }
          }
          emitter.$execInternal( bind, event )
        }, event, this )

        if( ret === true ) {
          //if this happens dont rly need to make a new event
          this.cancel()
        }
      }
    }
  }
} )

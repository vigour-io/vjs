"use strict";
var Base = require( '../../base' )
var set = Base.prototype.set
var remove = Base.prototype.remove
var Event = require( '../../event' )

/*
  async will create an event
  option $async: true // this will cancel previous asyncs
  http has true on default
  same for timeout
  same for postpone
  same for throttle
  you can write stuff to result to manage chunks
  bind.result
*/

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

module.exports = new Base( {
  $key: '$trigger',
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
            if( item.event.$trigger === item ) {
              item.event.clear()
            }
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
        // event.clear()
      }

    },
    $exec: function( event ) {
      var emitter = this._$parent
      var stamp = event.$stamp
      var inProgress
      var $binds
      var binds

      if( emitter.$lastStamp !== stamp ) {
        if( inProgress = this.$inProgress ){
          for (var i = inProgress.length - 1; i >= 0; i--) {
            var item = inProgress[i]
            if( event.$trigger !== item ){
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
      var trigger = this
      var oldevent

      var progress = {
        bind: bind,
        event: event
      }

      inProgress.push( progress )

      if( this._$input ) {
        //how to exec emitter????
        //dont do this for every instances -- they can share -- find origin
        oldevent = event
        event = new Event( bind, event.$type )
        event.$inherits = oldevent
        event.$trigger = progress
        event.$origin = bind

        var ret = this._$input.call( bind, function execEmitter() {
          var inProgress = trigger.$inProgress
          if( inProgress ) {

            var length = inProgress.length
            var i = length - 1

            for( ;i >= 0; i-- ) {
              if( inProgress[ i ] === progress ) {
                inProgress.splice( i, 1 )
                length--
              }
            }
            if( !length ) {
              trigger.$inProgress = null
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

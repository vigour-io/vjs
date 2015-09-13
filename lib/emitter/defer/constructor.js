"use strict";
var Base = require('../../base')
var set = Base.prototype.set
var remove = Base.prototype.remove
var exec = require('../exec/method.js')
var Event = require('../../event')

Event.prototype.inject(require('../../event/toString.js'))

module.exports = new Base({
  $key:'$defer',
  $flags: {
    cancel: function(val) {
      this._cancel = val
    }
  },
  $define: {
    remove: function() {
      if( this.$inProgress ) {
        this.cancel()
      }
      return remove.apply( this, arguments )
    },
    set: function() {
      return set.apply( this, arguments )
    },
    cancel: function() {
      if(this._cancel) {
        this._cancel.call( this.$inProgress.bind, this.$inProgress.event, this )
      }
      this.$inProgress = null
      this._$parent._$meta = null
      this._$parent._$emitting = null
      this._$parent.$isPostponed = null
    },
    $exec: function( event ) {

      // console.error('hey exec!', event.toString(), this._$parent.$lastStamp)

      if(this._$parent.$lastStamp === event.$stamp) {
        return
      }

      this._$parent.$lastStamp = event.$stamp


      if( this.$inProgress && event.$defered !== this
        && this.$inProgress.event !== event
       ) {
        // console.log('hey cancel exec!', this.$inProgress.event.toString())
        this.cancel()
      }

      var binds = this._$parent.$binds && this._$parent.$binds[event.$stamp]
      if( binds ) {
        for( var i = 0, length = binds.length; i < length; i++ ) {
          //same here --- way too heavy
          // binds[i].$resetContextsUp()
          // console.log('?2 - 1', binds[i].$path)
          this.$execInternal( binds[i], event )
        }
      }

      //now lets also do context
    },
    $execInternal: function( bind, event ) {
      var emitter = this._$parent

      // if( event.$defered === this ) {
      //   emitter.$execInternal( bind, event )
      //   return
      // }

      //this has to become very similair to 'bind' has to work for context and instances
      //maybe make it into 2 seperate things /w array
      //inProgress has to be made to support multiple binds

      //do this
      this.$inProgress = {
        event: event,
        bind: bind
      }

      //nested events
      var oldevent
      var defer = this
      var origin = event.$origin
      if( this._$val ) {
        //how to exec emitter????


        //dont do this for every instances -- they can share -- find origin
        if( origin !== bind && event.$defered !== this ) {
          // console.log('make new event', bind.$path)
          oldevent = event

          //make this more system
          event = new Event( bind, event.$type )
          event.$inherits = oldevent
          event.$defered = this
          event.$origin = bind
        }

        var ret = this._$val.call( bind, function execEmitter() {
          defer.$inProgress = null

          // this is totally fucked up
          if( event.$defered !== this ) {
            // console.log('?2')
            emitter.$execInternal( bind, event )
          } else {
            // console.warn('?')
            bind.emit( event.$type, event )
          }
          //oldevent

        }, event, this )
        if( ret === true ) {
          //if this happens dont rly need to make a new event
          this.cancel()
        }
      }
    }
  }
})

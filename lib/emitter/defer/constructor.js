"use strict";
var Base = require('../../base')
var set = Base.prototype.set
var remove = Base.prototype.remove
var exec = require('../exec/method.js')
var Event = require('../../event')

var isIncluded = function(arr, bind, event ) {
  for(var i in arr) {
    if(arr[i].bind === bind
      && ( arr[i].event.$stamp === event.$stamp
        || ( event.$inherits
        && event.$inherits.$stamp === arr[i].event.$stamp ))) {
          console.error('block')
      return true
    }
  }
}

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
      console.log('------', bind._$path)
      if(!this.$inProgress) {
        this.$inProgress = []
      } else if(isIncluded( this.$inProgress, bind, event )) {
        console.error('allready doing this', event.$stamp, bind)
        return;
      }
      var progress = {
        bind:bind,
        event: event
      }
      this.$inProgress.push(progress)
      var arrayIndex = this.$inProgress.length-1
      //nested events
      var oldevent
      var defer = this
      var origin = event.$origin
      if( this._$val ) {
        //how to exec emitter????
        //dont do this for every instances -- they can share -- find origin
        // if( origin !== bind  ) {
          // console.log('make new event', bind.$path)
          oldevent = event
          //make this more system
          event = new Event( bind, event.$type )
          event.$inherits = oldevent
          event.$defered = this.$inProgress[this.$inProgress.length-1]
          event.$origin = bind
        // }

        var ret = this._$val.call( bind, function execEmitter() {
          // defer.$inProgress = null
          // this is totally fucked up
          console.log('fun times', event.$defered && event.$defered.bind._$path)
          // if( event.$defered ) {
            console.log('?2')

            emitter.$execInternal( bind, event )

            var index
            console.log(defer.$inProgress)
            for(var i = 0; i < defer.$inProgress.length ; i++) {
              if( defer.$inProgress[i] === progress) {
                defer.$inProgress.splice(i,1)
              }
            }

            console.error('----->', bind._$path, defer.$inProgress.length)
            if(!defer.$inProgress.length) {
              console.error('..... cleared mofo')
              defer.$inProgress = null
            }
          // } else {
          //   console.warn('?--->', defer.$inProgress, bind._$path, event.$type)
          //   bind.emit( event.$type, event )
          // }
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

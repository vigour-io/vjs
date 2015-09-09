"use strict";
var Base = require('../../base')
var set = Base.prototype.set
var remove = Base.prototype.remove
var exec = require('../exec/method.js')

module.exports = new Base({
  $key:'$defer',
  $flags: {
    $cancel: function(val) {
      this._$cancel = val
    }
  },
  $define: {
    remove: function() {
      if( this.$inProgress ) {
        this.$cancel()
      }
      return remove.apply( this, arguments )
    },
    set: function() {
      return set.apply( this, arguments )
    },
    $cancel: function() {
      if(this._$cancel) {
        this._$cancel.call( this.$inProgress.bind, this.$inProgress.event, this )
      }
      this.$inProgress = null
    },
    $exec: function( bind, event ) {
      if( this.$inProgress ) {
        this.$cancel()
      }
      this.$inProgress = {
        event: event,
        bind: bind
      }
      var emitter = this._$parent
      var defer = this
      if( this._$val ) {
        var ret = this._$val.call( bind, function execEmitter() {
          defer.$inProgress = null
          emitter.$execInternal( bind, event )
        }, event, this )
        if( ret === true ) {
          this.$inProgress = null
        }
      }
    }
  }
})

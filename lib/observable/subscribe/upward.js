"use strict";
var onUpward = require('./on/upward')

exports.$define = {
  $subscribeUpward: function( obj, val, event, refLevel, level, meta, original ) {
    var fulfilled = this.$loopSubsObject( obj, val, event, refLevel, level, meta, original )
    var parent
    console.error('???',this,fulfilled)
    if( !fulfilled ) {
      if( parent = obj.$parent ) {
        return this.$subscribeUpward( parent, val, event, refLevel, level++, meta, original )
      }
      console.error('ADDING LISTENER',this.$path,obj.$path,obj.$rendered)
      obj.on( '$addToParent', [ onUpward, this, refLevel, level, val, original ] )
      return true
    }
  }
}

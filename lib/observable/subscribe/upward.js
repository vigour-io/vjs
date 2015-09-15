"use strict";
var onUpward = require('./on/upward')

exports.$define = {
  $subscribeUpward: function( obj, val, event, refLevel, level, meta, original ) {
    var fulfilled = this.$loopSubsObject( obj, val, event, refLevel, level, meta, original )
    var parent
    if( !fulfilled ) {
      if( parent = obj.$parent ) {
        return this.$subscribeUpward( parent, val, event, refLevel, level++, meta, original )
      }
      obj.on( '$addToParent', [ onUpward, this, refLevel, level, val, original ] )
      return true
    }
  }
}

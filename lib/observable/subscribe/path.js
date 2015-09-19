"use strict";

exports.$define = {
  $resolvePath: function( property, original, refLevel ) {
    if( refLevel > 1 ) {
      property = original
    }
    var path = property._$path
    var subsObs = this._$parent._$parent
    var cnt = 0
    var subsPath

    if(subsObs._$instances) {
      var root = property.$getRoot()
      var instances = subsObs._$instances
      for(var n in instances) {
        var instance = instances[n]
        var on = instance.$on
        if( (on && on[this.$key] === this)
        && instance.$getRoot() === root) {
          subsPath = instance._$path
          break;
        }
      }
    }

    if(!subsPath) {
      subsPath = subsObs._$path
    }

    var resolvePath = subsPath.concat()

    for( var i = 0, length = path.length; i<length; i++ ) {
      if( subsPath[i]===path[i] ) {
        resolvePath.splice((i-cnt),1)
        cnt++
      } else  {
        resolvePath.unshift('$parent')
      }
    }

    return resolvePath
  }
}
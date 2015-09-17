"use strict";

exports.$define = {
  $resolvePath: function( property, original, refLevel ) {
    if(refLevel>1) {
      property = original
    }
    var path = property._$path
    var subsObs = this._$parent._$parent
    var cnt = 0
    var subsPath

    if(subsObs._$instances) {
      var ancestor = property.$getAncestor()
      for(var n in subsObs._$instances) {
        if( (subsObs._$instances[n].$on && subsObs._$instances[n].$on[this.$key] === this)
        && subsObs._$instances[n].$getAncestor() === ancestor) {
          subsPath = subsObs._$instances[n]._$path
          break;
        }
      }
    }

    if(!subsPath) {
      subsPath = this._$parent._$parent._$path
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

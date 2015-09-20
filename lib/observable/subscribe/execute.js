"use strict";
exports.$define = {
  _execEmit:function( property, map, refLevel, event ){
    if(refLevel > 1){
      this._$parent._$parent.emit( this.$key, event)
    }else{
      this._findAndEmit( property, map, event )
    }
  },
  _findAndEmit: function( property, map, event, key ) {
    var next = property
    var value
    for(var i in map){
      value = map[i]
      if(value){
        if( next = property[i] ){
          if(value === true){
            next.emit( key || (key = this.$key), event)
          }else{
            this._findAndEmit( next, value, event, key)
          }
        }else{
          map[i] = null
        }
      }
    }
  }
}

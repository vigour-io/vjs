"use strict";
exports.$define = {
  _execEmit:function( property, map, refLevel, event ){
    if(refLevel > 1){
      this._$parent._$parent.emit( this.$key, event)
    }else{
      this._findAndEmit( property, map, event )
    }
  },
  _findAndEmit: function( property, map, event ) {
    var next = property
    for(var i in map){
      if(map[i]){
        if( next = property[i] ){
          if(map[i] === true){
            next.emit(this.$key, event)
          }else{
            console.log('????')
            this._findAndEmit( next, map[i], event)
          }
        }else{
          map[i] = null
        }
      }
    }
  }
}

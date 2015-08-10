"use strict";
exports.$inject = require('../../methods/lookUp')

exports.$define = {
  $addToInstances: function( event ) {
    var proto = Object.getPrototypeOf( this )
    if( !proto.hasOwnProperty( '_$instances' ) ) {
      proto._$instances = []
    }
    proto._$instances.push( this )
  },
  $removeFromInstances: function( event ) {
    var proto = Object.getPrototypeOf( this )
    if( proto.hasOwnProperty( '_$instances' ) ) {
      for( var i in proto._$instances ) {
        if(proto._$instances[i] === this) {
          proto._$instances.splice( i,1 )
          break;
        }
      }
    }
    if( this.hasOwnProperty( '_$instances' ) ) {
      var instances = this._$instances
      for(var i = 0, length = instances.length ; i < length; i++ ) {
        instances[i].remove( event )
        i--
        length--
      }
    }
  },
  $emitInstances: function( emitter, event, args ) {
    if( !emitter.$noInstances ) {
      var instances = this.hasOwnProperty('_$instances') && this._$instances
      var instance
      var parent
      var path
      var property
      var _property
      //optimize this ! e.g. remove removes all instances dont add instances for instances
      if( instances ) {
        for(var i = 0, length = instances.length; i < length; i++) {
          instance = instances[i]
          instance.$emit.apply( instance, args )
        }
      }else if( parent = this._$parent ){
        path = [this.$key]
        while(parent){
          if( parent.hasOwnProperty('_$instances') ){
            instances = parent._$instances
            break
          }
          path.push( parent.$key )
          parent = parent._$parent
        }
        if(instances){
          for(var i = 0, length = instances.length; i < length; i++) {
            instance = instances[i]
            for (var j = path.length - 1; j >= 0; j--) {
              property = path[j]
              _property = '_' + property
              instance = instance.hasOwnProperty( _property )
                ? instance[ _property ]//own property
                : instance[ property ]//getter
            }
            if(instance){
              // instance.$emit.apply( instance, args )
            }
          }
        }
      }
    }
  }
}

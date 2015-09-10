"use strict";
exports.$inject = require('../../methods/lookUp')

exports.$flags = {
  $trackInstances: function( val ) {
    this.$trackInstances = val
  }
}

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
        //hier gaat het weird!
        instances[i].remove( event )
        i--
        length--
      }
    }
  }
}

var Emitter = require( '../../emitter' )
var hash = require( '../../util/hash' )
var propertyListener = require( './property' )
var Event = require( '../../event' )
  //moving listener
  //references moving listener
  //property listeners // moves etc

function onProperty( event, meta, val, obj, subsemitter ){
	var added = meta.added
	var property
	var subvalue
	var key
	var i
	if(added){
		for (i = added.length - 1; i >= 0; i--) {
			key = added[i]
			subvalue = val[ key ]
			if( subvalue ){	        					
				property = obj[ key ]
				subsemitter.$addPropertyListener( property, subvalue , event )
			}
		}
	}
}

var SubsEmitter = new Emitter( {
  $meta: true,
  $define:{
  	$addPropertyListener:function( property, val, event ){
      if( val === true ){
        property.on('$change',[
          function( event, meta, subsemitter ) {
            subsemitter.emit( event, property )
          },
          this
        ] )
      }else{
      	this.$addPropertyListeners( property, val , event )
      }
  	},
  	$addPropertyListeners:function( obj, val, event ){
    	var property
    	var subvalue
      for( var key in val ) {
        property = obj[ key ]
        if( property ) {
        	this.$addPropertyListener( property, val[key], event )
        } else {
        	obj.on('$property',[onProperty, val, obj, this ])
        }
      }
  	}
  },
  $flags: {
    $pattern: function( val, event ) {
      //handle changing pattern (bit strange to do -- since key should change as well then)
      var observable = this._$parent._$parent
      this.$addPropertyListeners( observable, val, event )
    }
  }
  //maybe do some extras dont know yet
} ).$Constructor

exports.$define = {
  subscribe: function( pattern, val, key, unique, event ) {
    var stringified = JSON.stringify( pattern )
    var hashed = hash( stringified )
    var setObj

    if( !this.$on || !this.$on[ hash ] ) {
      setObj = {
        $on: {}
      }
      setObj.$on[ hashed ] = new SubsEmitter()
      this.set( setObj )
      this.$on[ hashed ].set( {
        $pattern: pattern
      } )
    }

    this.on( hashed, val, key, unique, event )

  }
}
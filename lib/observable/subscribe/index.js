var Base = require( '../../base' )
var Emitter = require( '../../emitter' )
var hash = require( '../../util/hash' )

//moving listener
//references moving listener
//property listeners // moves etc

var SubsEmitter = new Emitter( {
  $meta: true,
  $define:{
  	$subscribeToProperty:function( property, val, event ){
      if( val === true ){
        property.on('$change',[
          function( event, meta, subsemitter ) {
            subsemitter.emit( event, property )
          },
          this
        ] )
      }else{ //assumes object
      	this.$loopSubsObject( property, val , event )
      }
  	},
  	$loopSubsObject:function( obj, val, event ){
  		var reference
    	var subsvalue
    	var property
    	var self

      for( var key in val ) {

      	if(key === '*'){ //any
      	
      		self = this
      		obj.each(function( prop ){
      			self.$subscribeToProperty( prop, true, event )
      		})

					obj.on('$property',[onProperty, this, obj, val, true ])

      	}else if( key === '&' ){ //deep

      		// to do

      	}else{ //property
	        
	        property = obj[ key ]

	        if( property ) {
	        	this.$subscribeToProperty( property, val[key], event )
	        } else{
	        	reference = obj._$val

						if(reference && reference instanceof Base){
			      	this.$loopSubsObject( reference, val, event )
			      }

	        	if( key === '$parent' ){ //parent
	      			obj.on('$addToParent',[onParent, this, obj, val  ])
	      		}else{
	        		obj.on('$property',[onProperty, this, obj, val ])
	        	}
	        }

      	}
      }
  	}
  },
  $flags: {
    $pattern: function( val, event ) {
      //handle changing pattern (bit strange to do -- since key should change as well then)
      var observable = this._$parent._$parent
      this.$loopSubsObject( observable, val, event )
    }
  }
  //maybe do some extras dont know yet
} ).$Constructor

exports.$define = {
  subscribe: function( pattern, val, key, unique, event ) {
  	//TODO cache the stringified
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

function onProperty( event, meta, subsemitter, obj, val, any ){
	var added = meta.added
	var property
	var subsvalue
	var key
	var i

	if(added){
		for (i = added.length - 1; i >= 0; i--) {
			key = added[i]
			subsvalue = any || val[ key ]
			if( subsvalue ){
				property = obj[ key ]
				subsemitter.$subscribeToProperty( property, subsvalue , event )
				removeReferenceListeners( '$property', subsemitter, obj, onProperty)
			}
		}
	}
}

function onParent( event, meta, subsemitter, obj, val ){
	subsemitter.$subscribeToProperty( obj, val, event )
	removeReferenceListeners( '$addToParent', subsemitter, obj, onParent)
}

function removeReferenceListeners( type, subsemitter, obj, fn ){
	var reference = obj._$val
	var attach

	while(reference && reference.$on){
		attach = reference.$on[type].$attach
		attach.each(function(prop){
			if(prop[0] === fn && prop[1] === subsemitter){
				reference.off( type, fn )
			}
		})
		reference = reference._$val
	}
}
var Base = require( '../../base' )
var Event = require( '../../event' )
var Emitter = require( '../../emitter' )
var hash = require( '../../util/hash' )

//moving listener
//references moving listener
//property listeners // moves etc

var SubsEmitter = new Emitter( {
  $meta: true,
  $define:{
  	$subscribeToProperty:function( property, val, event, refIndex, fromListener ){
      if( val === true || typeof val === 'number' ){
        property.on('$change',[
          function( event, meta, subsemitter ) {
            subsemitter.emit( event, property )
          },
          this
        ] )
        if( fromListener ){
        	//QUESTION why do I need to force?
        	this.emit( event, property, true )
        }
      }else{ //assumes object
      	this.$loopSubsObject( property, val , event, refIndex, fromListener )
      }
  	},
  	$loopSubsObject:function( obj, val, event, refIndex, fromListener ){
  		var reference = obj._$val
  		var addedPropertyListener
    	var value
    	var property
    	var self

      for( var key in val ) {

      	value = val[key]

      	if( key === '&' ){ //deep
      		// to do
      	}else{ //property
	        property = obj[ key ]
	        if( property ) {
	        	this.$subscribeToProperty( property, value, event, refIndex, fromListener )
	        } else{
	        	if( key === '$parent' ){ //parent
	      			obj.on('$addToParent',[onParent, this, val, refIndex ])
	      		}else if( !addedPropertyListener ){
	      			if(key === '*'){
								self = this
			      		obj.each(function( prop ){
			      			self.$subscribeToProperty( prop, value, event, refIndex )
			      		})
			      		obj.on('$property',[onProperty, this, val, refIndex, true ])
	      			}else{
	      				obj.on('$property',[onProperty, this, val, refIndex ])
	      			}
	        		addedPropertyListener = true
	        	}
	        }
      	}
      }

			if(reference && reference instanceof Base){
      	this.$loopSubsObject( reference, val, event, refIndex ? refIndex + 1 : 1 )
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
      }, event )
    }
    this.on( hashed, val, key, unique, event )
  }
}

function onProperty( event, meta, subsemitter, val, refIndex, any ){
	var added = meta.added
	var property
	var value
	var key
	var i

	console.log('fire!')

	if(added){
		for (i = added.length - 1; i >= 0; i--) {
			key = added[i]
			value = any || val[key]
			if(value){
				if(!refIndex || !(typeof value === 'number' && value <= refIndex)){
					property = this[ key ]
					subsemitter.$subscribeToProperty( property, value, event, refIndex, true )
					
					removeReferenceListeners( '$property', subsemitter, this, onProperty, ( value === true || typeof value === 'number' ) && key)
					console.log('jaja',this )

					// removeListeners()

					var attach = this.$on.$property.$attach
					var obj = this

					attach.each(function( prop ){
						if(prop[0] === onProperty && prop[1] === subsemitter){
							var keepListener
							for(var i in val){
								if(i !== key){
									keepListener = true
									break
								}
							}
							if(!keepListener){
								obj.off('$property',onProperty)
							}
						}
					})

				}
			}
		}
	}
}

function onParent( event, meta, subsemitter, val, refIndex ){
	var property = this._$parent
	var value = val.$parent

	if(value){
		if(!refIndex || !(typeof value === 'number' && value <= refIndex)){
			var key = '$parent'
			property = this[ key ]
			subsemitter.$subscribeToProperty( property, value, event, refIndex, true )
			removeReferenceListeners( '$property', subsemitter, this, onProperty, ( value === true || typeof value === 'number' ) && key)


			var attach = this.$on.$addToParent.$attach
			var obj = this

			attach.each(function( prop ){
				if(prop[0] === onParent && prop[1] === subsemitter){
					var keepListener
					for(var i in val){
						if(i !== key){
							keepListener = true
							break
						}
					}
					if(!keepListener){
						obj.off('$addToParent',onParent)
					}
				}
			})

		}
	}

	// subsemitter.$subscribeToProperty( property, value, event, refIndex, true )
	// removeReferenceListeners( '$addToParent', subsemitter, obj, onParent, '$parent' )//, ( value === true || typeof value === 'number' ) && key
}


//remove listeners

function removeReferenceListeners( type, subsemitter, obj, fn, key){
	var reference = obj._$val
	var referenceField
	var changeAttach
	var attach
	var change
	var on

	while(reference){

		if(key){
			//1.remove the change listener if it's there
			referenceField = reference[key] 
			if( referenceField){
				on = referenceField.$on
				if(on){
					change = on.$change
					if(change){
						changeAttach = change.$attach
						if(changeAttach){
							changeAttach.each(function(prop){
								if(prop[1] === subsemitter){
									//TODO this has to be more specific
									referenceField.off( '$change', prop[0])
								}
							})
						}
					}
				}
			}
		}

		if(reference.$on && reference.$on[type]){

			attach = reference.$on[type].$attach

			if(attach){
				attach.each(function(prop){
					if(prop[0] === fn && prop[1] === subsemitter){

						//is this correct? why are the args stored here?
						var args = prop[2]
						var dontRemoveListener
						var subsObj = args[1]
						var refIndex
						var value = subsObj[key]

						console.log('prop',prop, args)

						if(key){
							//2.mark the subsObj with a number to ignore in onProperty
							refIndex = args[2]
							if(value === true || value > refIndex){
								subsObj[key] = refIndex - 1
							}
						}

						for(var i in subsObj){
							value = subsObj[i]
							if(value === true || value > refIndex){
								dontRemoveListener = true
								break
							}
						}

						if(!dontRemoveListener){
							console.log('remove listener', type , 'on', reference.$key)
							//TODO this has to be more specific
							reference.off( type, fn )
						}
					}
				})
			}
		}
		reference = reference._$val
	}
}

function removeListeners( subsemitter, obj, key ){

}

// function removePropertyListener( obj, subsemitter ){
// 	var $on = obj.$on
// 	if( $on ){
// 		var $property = $on.$property
// 		if( $property ){
// 			var $attach = $property.$attach
// 		}
// 	}
// }
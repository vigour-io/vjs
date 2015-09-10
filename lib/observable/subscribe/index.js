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

      	if(key === '*'){ //any
      	
      		self = this
      		obj.each(function( prop ){
      			self.$subscribeToProperty( prop, value, event, refIndex )
      		})

					obj.on('$property',[onProperty, this, obj, val, refIndex, true ])
					addedPropertyListener = true

      	}else if( key === '&' ){ //deep
      		// to do
      	}else{ //property
	        property = obj[ key ]
	        if( property ) {
	        	this.$subscribeToProperty( property, value, event, refIndex, fromListener )
	        } else{
	        	if( key === '$parent' ){ //parent
	      			obj.on('$addToParent',[onParent, this, obj, value, refIndex ])
	      		}else if( !addedPropertyListener ){
	        		obj.on('$property',[onProperty, this, obj, val, refIndex ])
	        		addedPropertyListener = true
	        	}
	        }
      	}
      }

			if(reference && reference instanceof Base){
				// reference._$subsIndex = reference._$subsIndex ? reference._$subsIndex + 1 : 0
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

function onProperty( event, meta, subsemitter, obj, val, refIndex, any ){
	var added = meta.added
	var property
	var value
	var key
	var i

	if(added){
		for (i = added.length - 1; i >= 0; i--) {
			key = added[i]
			value = any || val[key]
			if(value){
				if(!refIndex || !(typeof value === 'number' && value <= refIndex)){
					property = obj[ key ]
					subsemitter.$subscribeToProperty( property, value, event, refIndex, true )
					removeReferenceListeners( '$property', subsemitter, obj, onProperty, ( value === true || typeof value === 'number' ) && key)
				}
			}
		}
	}
}

function onParent( event, meta, subsemitter, obj, val, refIndex ){
	var property = obj._$parent
	subsemitter.$subscribeToProperty( property, val, event, refIndex, true )
	removeReferenceListeners( '$addToParent', subsemitter, obj, onParent, '$parent')
}

function removeReferenceListeners( type, subsemitter, obj, fn, key){
	var reference = obj._$val
	var referenceField
	var changeAttach
	var attach

	while(reference && reference.$on){
		
		attach = reference.$on[type].$attach
		
		if(key){
			//1.remove the change listener if it's there
			referenceField = reference[key]
			if( referenceField && referenceField.$on.$change ){
				changeAttach = referenceField.$on.$change.$attach
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



		if(attach){
			attach.each(function(prop){
				if(prop[0] === fn && prop[1] === subsemitter){
					var dontRemoveListener
					var subsObj = prop[3]
					var refIndex
					var value = subsObj[key]

					if(key){
						console.log('...set it',subsObj[key] > prop[4],subsObj[key], prop[4])
						//2.mark the subsObj with a number to ignore in onProperty
						refIndex = prop[4]
						if(value === true || value > refIndex){
							subsObj[key] = refIndex - 1
						}
					}

					for(var i in subsObj){
						value = subsObj[i]
						if(value === true || value > refIndex){
							console.log('check!',i,refIndex,value)
							dontRemoveListener = true
							break
						}
					}

					console.log('the subs for ',reference.$key,subsObj, refIndex, dontRemoveListener)
					if(!dontRemoveListener){
						//TODO this has to be more specific
						console.log('remove the listener from',reference.$key,subsObj)
						reference.off( type, fn )
					}
				}
			})
		}

		reference = reference._$val
	}
}
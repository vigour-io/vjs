var Base = require( '../../base' )
var Event = require( '../../event' )
var Emitter = require( '../../emitter' )
var hash = require( '../../util/hash' )

var $ADDTOPARENT = '$addToParent'
var $UPWARD = '$upward'
var $REFERENCE = '$reference'
var $PROPERTY = '$property'
var $CHANGE = '$change'
var $PARENT = '$parent'
var $VAL = '$val'

var SubsEmitter = new Emitter( {
  $meta: true,
  $define: {
    $addChangeListener: function( property, val, key, event, refLevel, level, meta ) {
      //remove all related listeners
      var $listensOnAttach = this.$listensOnAttach
      var path = property.$path.join( '.' )
        //mark the field as found, with refLvl and lvl
      val[ key ] = encoded( refLevel, level )
      if( $listensOnAttach ) {
        $listensOnAttach.each( function( p ) {
          var type = p.$key
            //remove redundant property and parent listeners
          if( type === $PROPERTY || type === $ADDTOPARENT ) {
            function removeRedundantListeners( prop, key ) {
              if( !keepListener( val, prop[ 2 ] ) ) {
                p.$attach.$removeProperty( prop, key )
              }
            }
            p.$attach.each( removeRedundantListeners )
              //remove change listeners which are listening for the same thing
          } else if( type === $CHANGE ) {
            //perhaps pass this path in attach
            p.$attach.each( function( prop, key ) {
              if( key === path ) {
                p.$attach.$removeProperty( prop, key )
              }
            } )
          }
        } )
      }
      //add the new change listener
      property.on( $CHANGE, [ onChange, this, refLevel, level ], path )
        //if this came from a listener, fire the subscription
      if( meta ) {
        //why do I need to force when it comes from parent
        this.emit( event, property, true, meta )
      }
    },
    $subscribeUpward: function( obj, val, event, refLevel, level, meta ) {
      var fulfilled = this.$loopSubsObject( obj, val, event, refLevel, level, meta )
      var parent
      if( !fulfilled ) {
        if( parent = obj.$parent ) {
          return this.$subscribeUpward( parent, val, event, refLevel, level++, meta )
        }
        obj.on( $ADDTOPARENT, [ onUpward, this, refLevel, level, val ] )
        return true
      }
    },
    $subscribeToProperty: function( property, val, key, event, refLevel, level, meta ) {
      var value = val[ key ]
      if( value === true ) {
        this.$addChangeListener( property, val, key, event, refLevel, level, meta )
        return true
      }
      if( typeof value === 'number' ) {
        if( decodedLevel( value ) >= level ) {
          this.$addChangeListener( property, val, key, event, refLevel, level, meta )
        }
        return true
      }
      return this.$loopSubsObject( property, value, event, refLevel, level, meta )
    },
    $loopSubsObject: function( obj, val, event, refLevel, level, meta ) {
      var addedPropertyListener
      var addedParentListener
      var addedUpwardListener
      var reference
      var property
      var upward
      var value
      var self
      for( var key in val ) {
        value = val[ key ]
        if( key === '&' ) { //deep
          // to dont
        } else if( key === $VAL ) {
          this.$subscribeToProperty( obj, val, key, event, refLevel, level, meta )
        } else { //property
          property = obj[ key ]
          if( property && property._$val !== null ) {
            this.$subscribeToProperty( property, val, key, event, refLevel, level, meta )
          } else {
            if( key === $PARENT ) { //parent
              obj.on( $ADDTOPARENT, [ onParent, this, refLevel, level, val ] )
              addedParentListener = true
            } else if( key === $UPWARD ) { //up the chain
              addedUpwardListener = this.$subscribeUpward( obj, value, event, refLevel, level )
            } else if( !addedPropertyListener ) {
              if( key === '*' ) {
                self = this
                obj.each( function( prop, key ) {
                  val[ key ] = encoded( refLevel )
                  self.$subscribeToProperty( prop, val, key, event, refLevel, level )
                } )
                obj.on( $PROPERTY, [ onProperty, this, refLevel, level, val, true ] )
              } else {
                obj.on( $PROPERTY, [ onProperty, this, refLevel, level, val ] )
              }
              addedPropertyListener = true
            }
          }
        }
      }
      //if subscriptions have been fulfilled
      if( !addedPropertyListener && !addedParentListener && !addedUpwardListener ) {
        return true
      }
      //else check references
      if( ( reference = obj._$val ) && reference instanceof Base ) {
        obj.on( $REFERENCE, [ onReference, this, ++refLevel, level, val ] )
        this.$loopSubsObject( reference, val, event, refLevel, level )
      }
    }
  },
  $flags: {
    $pattern: function( val, event ) {
      //handle changing pattern (bit strange to do -- since key should change as well then)
      var observable = this._$parent._$parent
      this.$loopSubsObject( observable, val, event, 1, 1 )
      this._$pattern = val
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
      return this.$on[ hashed ]
    }
  }
  //listeners
function onChange( event, meta, subsemitter, refLevel, level ) {
  if( meta ) {
    //dirty! updating entire subscription, if there is refs
    var subsOrigin = subsemitter._$parent._$parent
    if( subsOrigin._$val ) {
      subsemitter.$loopSubsObject( subsOrigin, subsemitter._$pattern, event, 1, level )
    }
  }
  subsemitter.emit( event, this, false, meta )
}

function onProperty( event, meta, subsemitter, refLevel, level, val, any ) {
  if( meta ) {
    var added = meta.added
    if( added ) {
      for( var i = added.length - 1; i >= 0; i-- ) {
        var key = added[ i ]
        if( any ) {
          val[ key ] = encoded( refLevel )
        }
        var value = val[ key ]
        if( value !== void 0 ) {
          subsemitter.$subscribeToProperty( this[ key ], val, key, event, refLevel, level, meta )
        }
      }
    }
  }
}

function onUpward( event, meta, subsemitter, refLevel, level, val ) {
  var parent = this.$parent
  subsemitter.$subscribeUpward( parent, val, event, refLevel, level + 1, true )
}

function onParent( event, meta, subsemitter, refLevel, level, val ) {
  var parent = this.$parent
  var value = val.$parent
  subsemitter.$subscribeToProperty( parent, val, $PARENT, event, refLevel, level, true )
}

function onReference( event, meta, subsemitter, refLevel, level, val ) {
  //remove the old ref listeners
  subsemitter.$listensOnAttach.each( function( property ) {
      property.$attach.each( function( prop, key ) {
        if( prop[ 2 ][ 1 ] >= refLevel ) {
          property.$attach.$removeProperty( prop, key )
        }
      } )
    } )
    //add the new ref listeners
  var referenced = this._$val
  if( referenced ) {
    subsemitter.$loopSubsObject( referenced, val, event, refLevel, level, meta )
  }
}

function encoded( refLevel, level ) {
  return( refLevel << 8 ) | level
}

function decodedRefLevel( nr ) {
  return( nr >> 8 ) & 0xff
}

function decodedLevel( nr ) {
  return nr & 0xff
}

function keepListener( val, args ) {
  var myRefLevel = args[ 1 ]
  var myLevel = args[ 2 ]
  for( var i in val ) {
    var v = val[ i ]
    if( ( v === true || decodedRefLevel( v ) > myRefLevel || decodedLevel( v ) > myLevel ) && i !== $PARENT && i !== $VAL ) {
      return true
    }
  }
}

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
    $removeRelatedListeners: function( property, val, key, event, refLevel ) {
      var key = property.$key
      var $listensOnAttach = this.$listensOnAttach

      val[ key ] = refLevel

      if( $listensOnAttach ) {
        $listensOnAttach.each( function( p ) {
          var type = p.$key
          if( type === $PROPERTY ) {
            p.$attach.each( function( prop, key ) {
              var myrefLevel = prop[ 2 ][ 1 ]
              var keepListener
              
              for( var j in val ) {
                var v = val[ j ]
                if( ( v === true || v > myrefLevel ) && j !== $PARENT && j !== $VAL ) {
                  keepListener = true
                  break
                }
              }

              if( !keepListener ) {
                p.$attach.$removeProperty( prop, key )
              }
            } )

          } else if( type === $CHANGE ) {
            if( p._$parent._$parent.$key === key ) {
              p.$attach.each( function( prop, key ) {
                p.$attach.$removeProperty( prop, key )
              } )
            } 
          } else if( type === $ADDTOPARENT ) {

            // if( p._$parent._$parent.$key === key ) {
            //   p.$attach.each( function( prop, key ) {
            //     p.$attach.$removeProperty( prop, key )
            //   } )
            // } 
          }
        } )
      }
    },
    $subscribeToProperty: function( property, val, key, event, refLevel, meta ) {
      var value = val[key]
      if( value === true || typeof value === 'number' ) {
      	this.$removeRelatedListeners( property, val, key, event, refLevel )
        property.on( $CHANGE, [
          function( event, removed, subsemitter ) {
            if( removed ){
              //dirty! redoing updating subscription, if there is refs
              var subsOrigin = subsemitter._$parent._$parent
              if(subsOrigin._$val){
                subsemitter.$loopSubsObject( subsOrigin, subsemitter._$pattern, event, 1 )
              }
            }
            subsemitter.emit( event, property, false, meta )
          },
          this, refLevel
        ])
        if( meta ) {
          //why do I need to force when it comes from parent
          this.emit( event, property, true, meta )
        }
      } else {
         //assumes object
        this.$loopSubsObject( property, value, event, refLevel, meta )
      }
    },
    $loopSubsObject: function( obj, val, event, refLevel, meta ) {
      var reference = obj._$val
      var addedPropertyListener
      var value
      var property
      var self
      var found

      for( var key in val ) {
        value = val[ key ]

        if( key === '&' ) { //deep
          // to dont
        } else if( key === $VAL ){
          this.$subscribeToProperty( obj, val, key, event, refLevel, meta )
        } else { //property
          property = obj[ key ]
          if( property && property._$val !== null) {
            this.$subscribeToProperty( property, val, key, event, refLevel, meta )
          } else {
            if( key === $PARENT ) { //parent
              obj.on( $ADDTOPARENT, [ onParent, this, refLevel, val  ] )
            } else if( key === $UPWARD ) { //up the chain

              var next = obj
              while( next ){
                this.$subscribeToProperty( next, val, key, event, refLevel, meta )
                next = next.$parent
              }

              // this.$subscribeToProperty( obj, val, key, event, refLevel, meta )




              // if(!val.$parent){
              //   val.$parent = value
              // }else if(val.$parent === true || typeof val.$parent ==='number'){
              //   val.$parent = value
              // }else{

              // }
              // val.$parent.$val = value
              // onAnchestor.call(obj, event, meta, this, refLevel, val)
            } else if( !addedPropertyListener ) {
              if( key === '*' ) {
                self = this
                obj.each( function( prop, key ) {
                	val[key] = refLevel || true
                  self.$subscribeToProperty( prop, val, key, event, refLevel )
                } )
                obj.on( $PROPERTY, [ onProperty, this, refLevel, val, true ] )
              } else {
                obj.on( $PROPERTY, [ onProperty, this, refLevel, val ] )
              }
              addedPropertyListener = true
            }
          }
        }
      }

      //handle refs
      if( reference && reference instanceof Base ) {
        obj.on( $REFERENCE,[ updateRefListeners, this, ++refLevel, val ] )
        this.$loopSubsObject( reference, val, event, refLevel )
      }

    }
  },
  $flags: {
    $pattern: function( val, event ) {
      //handle changing pattern (bit strange to do -- since key should change as well then)
      var observable = this._$parent._$parent
      this.$loopSubsObject( observable, val, event, 1 )
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

function onAnchestor( event, meta, subsemitter, refLevel, val ){
  var parent = this.$parent
  var nextParent
  if(parent){
    subsemitter.$subscribeToProperty( parent, val, $PARENT, event, refLevel, meta || true )
    nextParent = parent.$parent
    while( nextParent ){
      subsemitter.$subscribeToProperty( nextParent, val, $PARENT, event, refLevel )
      parent = nextParent
      nextParent = parent.$parent
    }
  }
  ( parent || this ).on( $ADDTOPARENT, [ onAnchestor, subsemitter, refLevel, val ] )
}

function onProperty( event, meta, subsemitter, refLevel, val, any ) {
  if(meta){
    var added = meta.added
    if( added ) {
      for( var i = added.length - 1; i >= 0; i-- ) {
        var key = added[ i ]

        if(any){
          val[key] = refLevel || true
        }

        var value = val[ key ]
        if( value ) {
          subsemitter.$subscribeToProperty( this[ key ], val, key, event, refLevel, meta )
        }
      }
    }
  }
}

function onParent( event, meta, subsemitter, refLevel, val ) {
  var parent = this.$parent
  var value = val.$parent
  subsemitter.$subscribeToProperty( parent, val, $PARENT, event, refLevel, true )
}

function updateRefListeners( event, meta, subsemitter, refLevel, val ){
  //remove the old ref listeners
  subsemitter.$listensOnAttach.each(function(property){
    property.$attach.each(function( prop, key ){
      if(prop[2][1] >= refLevel){
        property.$attach.$removeProperty( prop, key )
      }
    })
  })
  //add the new ref listeners
  var referenced = this._$val
  if(referenced){
    subsemitter.$loopSubsObject( referenced, val, event, refLevel, meta )
  }
}
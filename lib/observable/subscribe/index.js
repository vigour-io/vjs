var Base = require( '../../base' )
var Event = require( '../../event' )
var Emitter = require( '../../emitter' )
var hash = require( '../../util/hash' )

var $ADDTOPARENT = '$addToParent'
var $PROPERTY = '$property'
var $CHANGE = '$change'
var $PARENT = '$parent'
var $REFERENCE = '$reference'

var SubsEmitter = new Emitter( {
  $meta: true,
  $define: {
    $removeRelatedListeners: function( property, val, key, event, refLevel ) {
      var key = property.$key
      var $listensOnattach = this.$listensOnattach

      val[ key ] = refLevel

      // THE SUBSCRIPTION IS FULFILLED!
      // - remove change listeners on the endpoints on referenced objects
      // - remove property listeners on referenced objects related to this sub
      // - remove my own property listener

      // get the path and find out if you have any listeners to remove!
      if( $listensOnattach ) {
        $listensOnattach.each( function( p ) {
          var type = p.$key
          if( type === $PROPERTY ) {

            // - remove property listeners on referenced objects related to this sub 
            // - remove my own property listener CHECK

            p.$attach.each( function( prop, key ) {
              var myrefLevel = prop[ 2 ][ 1 ]
              var keepListener
              
              for( var j in val ) {
                var v = val[ j ]
                if( ( v === true || v > myrefLevel ) && j !== $PARENT ) {
                  keepListener = true
                  break
                }
              }

              if( !keepListener ) {
                p.$attach.$removeProperty( prop, key )
              }
            } )

          } else if( type === $CHANGE ) {
            // - remove change listeners on the endpoints on referenced objects CHECK
            if( p._$parent._$parent.$key === key ) {
              p.$attach.each( function( prop, key ) {
                p.$attach.$removeProperty( prop, key )
              } )
            }
          }
        } )
      }
    },
    $subscribeToProperty: function( property, val, key, event, refLevel, fromListener ) {
      var value = val[key]

      if( value === true || typeof value === 'number' ) {

      	this.$removeRelatedListeners( property, val, key, event, refLevel )

        property.on( $CHANGE, [
          function( event, removed, subsemitter ) {
            if( removed ){
              //dirty! redoing entire subscription, if there is refs
              var subsOrigin = subsemitter._$parent._$parent
              if(subsOrigin._$val){
                subsemitter.$loopSubsObject( subsOrigin, subsemitter._$pattern, event, 1 )
              }
            }
            subsemitter.emit( event, property )
          },
          this, refLevel
        ])

        if( fromListener ) {
          this.emit( event, property )
        }

      } else { //assumes object
        this.$loopSubsObject( property, value, event, refLevel, fromListener )
      }
    },
    $loopSubsObject: function( obj, val, event, refLevel, fromListener ) {
      var reference = obj._$val
      var addedPropertyListener
      var value
      var property
      var self

      for( var key in val ) {
        value = val[ key ]

        if( key === '&' ) { //deep

          // to do

        } else { //property
          property = obj[ key ]
          if( property && property._$val !== null) {
            this.$subscribeToProperty( property, val, key, event, refLevel, fromListener )
          } else {
            if( key === $PARENT ) { //parent
              // obj.on( $ADDTOPARENT, [ onParent, this, refLevel, val  ] )
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

      if( reference && reference instanceof Base ) {
        // add reference listeners
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
          subsemitter.$subscribeToProperty( this[ key ], val, key, event, refLevel, true )
        }
      }
    }
  }
}

function updateRefListeners( event, previousReference, subsemitter, refLevel, val ){
  //remove the old ref listeners
  subsemitter.$listensOnattach.each(function(property){
    property.$attach.each(function( prop, key ){
    if(prop[2][1] >= refLevel){
      property.$attach.$removeProperty( prop, key )
    }
  })
  })
  //add the new ref listeners
  var referenced = this._$val
  if(referenced){
    subsemitter.$loopSubsObject( referenced, val, event, refLevel, true )
  }
}

// //parent is not done!
// function onParent( event, meta, subsemitter, refLevel, val ) {
//   var property = this._$parent
//   var value = val.$parent
//   var removedListeners

//   if( value ) {
//     if( !refLevel || !( typeof value === 'number' && value <= refLevel ) ) {
//       property = this.$parent

//       if( !removedListeners ) {
//         subsemitter.$listensOnattach.each( function( property ) {
//           var type = property.$key

//           if( type === $ADDTOPARENT ) {
//             //remove this each!
//             property.$attach.each( function( prop, key ) {
//               var myrefLevel = prop[ 2 ][ 2 ]
//               var v = val.$parent


//               //TODO only remove if the end point of the sub is found!
//               property.$attach.$removeProperty( prop, key )
//             } )

//           } else if( type === $CHANGE ) {
//             if( property._$parent._$parent.$key === $PARENT ) {
//               property.$attach.each( function( prop, key ) {
//                 property.$attach.$removeProperty( prop, key )
//               } )
//             }
//           }
//         } )
//         removedListeners = true
//       }

//       subsemitter.$subscribeToProperty( property, value, event, refLevel, true )
//     }
//   }
// }

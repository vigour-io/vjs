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
    $addChangeListener: function( property, val, key, event, refLevel, level, meta, mygetPath ) {

      //remove all related listeners
      var $listensOnAttach = this.$listensOnAttach
      var propPath = property.$path.join( '.' )
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
              if( key === propPath ) {
                p.$attach.$removeProperty( prop, key )
              }
            })
          }
        })
      }
      //add the new change listener
      property.on( $CHANGE, [ onChange, this, refLevel, level, mygetPath ], propPath )

      //if this came from a listener, fire the subscription

      //weird piece
      if( meta ) {
        console.group()
        console.log('%cfire emitter (gotz prop or somethin)','color:teal', meta, property._$path, mygetPath)
        var temp = property
        var subsObs = this._$parent._$parent
        for(var i in mygetPath) {

          console.log(mygetPath[i], temp._$path, temp)
          temp = temp[mygetPath[i]]
          if(!temp) {

            console.log('%cCANT FIND EMIT FROM PROP ADDED', 'color:white;background:teal;padding:2px;',
              '\n\n i:', i,
              '\n mygetpath["'+i+'"]:', mygetPath[i],
              '\n mygetPath:', mygetPath,
              '\n propPath:', property._$path
            )
            break;
          }
        }
        if(temp) {
          console.log('this biatch muss be the propz')
          //since using the same evnet temp will not fire for some cases

          console.log('this biatch muss be the propz', event.$origin === temp, event.$type )
          // if(event.$origin === temp) {
          //   event.$type = this.$key


          //WARNING --- CHANGE ADD TO PARENT LISTENER TO BE ABLE TO EXEC POSTPONED!!!

          // }
          console.log('lezzz emit it!')
          temp.emit(this.$key, event)
        }
        console.groupEnd()
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

      // console.log('%c subscribeToProperty!','color:teal', key)

      var value = val[ key ]
      if( value === true ) {

        console.log('go go !', key, value, val, 'now i need my path in the subsobj (where im i?)')

        //val === obj -- this is where my path is at

        //add target


        var myGetPath = resolvePath.call( this, property)

        this.$addChangeListener( property, val, key, event, refLevel, level, meta, myGetPath )
        return true
      }
      if( typeof value === 'number' ) {
        if( decodedLevel( value ) >= level ) {

          console.log('go go over aref -->PATH STILL WRONG!', key, value, level)
          var myGetPath = resolvePath.call( this, property)
          //dit is nog erg shacky --- more op de non ref

          this.$addChangeListener( property, val, key, event, refLevel, level, meta, myGetPath )
        }
        return true
      }

      // console.log('go go over aref!', key, value, level)

      return this.$loopSubsObject( property, value, event, refLevel, level, meta )
    },
    $loopSubsObject: function( obj, val, event, refLevel, level, meta ) {
      console.log('arllgith loopin', arguments)

      var addedPropertyListener
      var addedParentListener
      var addedUpwardListener
      var reference
      var property
      var value
      var self

      for( var key in val ) {
        value = val[ key ]
        if( key === '&' ) { //deep
          // to dont
        } else if( key === $VAL ) {
          console.log('val subs', $VAL)

          this.$subscribeToProperty( obj, val, key, event, refLevel, level, meta )
        } else { //property
          property = obj[ key ]
          if( property && property._$val !== null ) {

            console.warn('prop is here!', key)


            this.$subscribeToProperty( property, val, key, event, refLevel, level, meta )
          } else {
            if( key === $PARENT ) { //parent

              console.log('%cparent bitches', 'color:purple',$PARENT)

              //dont use $parent else contexts can become a huge problemo

              obj.on( $ADDTOPARENT, [ onParent, this, refLevel, level, val ] )
              addedParentListener = true
            } else if( key === $UPWARD ) { //up the chain

              console.log('UPWARD bitches', $UPWARD)

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
      this._$pattern = val
      this.$loopSubsObject( observable, val, event, 1, 1 )
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
function onChange( event, meta, subsemitter, refLevel, level, resolvedPath ) {
  if( meta ) {
    //dirty! updating entire subscription, if there is refs
    var subsOrigin = subsemitter._$parent._$parent
    if( subsOrigin._$val ) {
      subsemitter.$loopSubsObject( subsOrigin, subsemitter._$pattern, event, 1, level )
    }
  }

  var subsPath = subsemitter._$parent._$parent._$path

  console.warn('hello! \nsubspath:', subsPath, '\nresolvedpath:', resolvedPath, '\nthis path:', this._$path )

  var myObservableResolved
  var temp = this
  for(var i in resolvedPath) {
    temp = temp[resolvedPath[i]]
  }

  if(temp) {
    myObservableResolved = temp

    //this emit can fuck shit up unfortunately -- nothing todo with subscriptio
    console.log('lets emit---->', myObservableResolved.$path)
    myObservableResolved.emit( subsemitter.$key, event )
  } else {
    console.error('cant find', resolvedpath, 'from:', this._$path)
  }


  // myObservableResolved.$on[subsemitter.$key].emit( event, myObservableResolved )
  // console.log('change!', this.$path, subsemitter.$parent.$parent.$path)
  // subsemitter._$parent._$parent.emit(subsemitter.$key)
  // subsemitter.emit(event)
}

function onProperty( event, meta, subsemitter, refLevel, level, val, any ) {
  console.error('PROPERTY')
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
  console.error('UPWARD',this)
  var parent = this.$parent
  subsemitter.$subscribeUpward( parent, val, event, refLevel, level + 1, true )
}

function onParent( event, meta, subsemitter, refLevel, level, val ) {
  console.error('PARENT')
  var parent = this.$parent
  var value = val.$parent

  subsemitter.$subscribeToProperty( parent, val, $PARENT, event, refLevel, level, true )
}

function onReference( event, meta, subsemitter, refLevel, level, val ) {
  console.error('REFERENCE')
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

function resolvePath(property) {
  console.group()
  console.log('pathFinder')

  var path = property._$path
  var subsObs = this._$parent._$parent
  var subsPath

  if(subsObs._$instances) {
    var ancestor = property.$getAncestor()
    for(var n in subsObs._$instances) {
      if( (subsObs._$instances[n].$on && subsObs._$instances[n].$on[this.$key] === this)
      && subsObs._$instances[n].$getAncestor() === ancestor) {
        console.error('this is my instance!')
        subsPath = subsObs._$instances[n]._$path
        break;
      }
    }
  }

  if(!subsPath) {
    subsPath = this._$parent._$parent._$path
  }

  var cnt = 0
  var mygetPath = subsPath.concat()
  for(var i in path) {
    if( subsPath[i]===path[i] ) {
      mygetPath.splice((i-cnt),1)
      cnt++
    } else  {
      mygetPath.unshift('$parent')
    }
  }

  console.log('%cresolved path for this:', 'color:blue;font-weight:bold;',
    '\nresolvedPath:', mygetPath,
    '\nproperty:', property._$path,
    '\nsubsPath:', subsPath
  )

  console.groupEnd()
  console.log('\n\n')

  return mygetPath
}

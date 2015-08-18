"use strict";

var Base = require( '../../base' )
var Event = require( '../../event' )

var setWithPath = require( '../../util/setwithpath' )
// module.exports = function subscribe( pattern, listeners, event ){
var subscribe = module.exports = function subscribe( target, emitter, event,
  pattern, originalTarget ) {

  // if(!event) {
  //   event = new Event(  )
  // }

  if( !pattern  ) { // this means first call in the flow
    // log('HA NEW', event)
    pattern = emitter.$pattern
    originalTarget = target
  }

  // console.log( '---------- > $SUPSCRIBS', target, pattern )

  // walk over references
  target = walkRefs( target, emitter, pattern, originalTarget, event )

  // if pattern is true, subscribe to this!
  if( pattern._$val === true ) {
    console.log('!!!!!!!!!! add dat listeners!')
    var passon = createPasson( emitter, originalTarget, pattern )
    target.on( '$change', passon )

    if( event ) {
      var subsmeta = emitter._$meta || (emitter._$meta = {})
      addChangeToMeta( subsmeta, target, originalTarget, pattern )
      emitter.$emit( event, originalTarget )
    }

    return
  }

  var missingPropHandler

  pattern.each(function( patternPart, key ){

    if( key === 'any$' ) { // any$
      // listen to changes on all properties

      if( patternPart.$val === true ) { // directly


        target.each(function( targetProp ) {

          targetProp = walkRefs(
            targetProp, emitter, patternPart, originalTarget, event
          )

          // console.log('subscribe!', targetProp.$path)
          var passon = createPasson( emitter, originalTarget, patternPart )
          targetProp.on( '$change', passon )

          if( event ) {
            var subsmeta = emitter._$meta || (emitter._$meta = {})
            addChangeToMeta( subsmeta, targetProp, originalTarget, patternPart )
            emitter.$emit( event, originalTarget )
          }
        })
      } else { // nested
        target.each(function( targetProp ) {
          targetProp = walkRefs( targetProp, emitter, pattern, originalTarget,
            event )
          subscribe( targetProp, emitter, event, patternPart, originalTarget )
        })
      }

      // add property listener to add listeners inside new properties
      // console.log('adding property listener to', target )

      var propHandler = createPH( target, emitter, patternPart, originalTarget )

      target.on( '$property', [ propHandler, emitter ] )

      // console.log('done adding property listener')
    } else { // not any$ > specific key

      var targetProp = target[key]

      if( targetProp ) { // property is present
        // console.log('yes i have that key!', key)
        targetProp = walkRefs( targetProp, emitter, patternPart, originalTarget,
          event
        )
        if( patternPart.$val === true ) {
          console.log('yes this is targeted burp')

          var passon = createPasson( emitter, originalTarget, patternPart )
          targetProp.on( '$change', passon )
          if( event ) {
            // console.log('and fire!')
            var subsmeta = emitter._$meta || (emitter._$meta = {})
            addChangeToMeta( subsmeta, targetProp, originalTarget, patternPart )
            emitter.$emit( event, originalTarget )
          }

        } else {
          subscribe( targetProp, emitter, event, patternPart, originalTarget )
        }
      } else if( !missingPropHandler ){
        // property is not present and havent added
        // missing property listener yet
        missingPropHandler = createMPH( target, pattern, emitter,
          originalTarget )
        target.on( '$property', [missingPropHandler, emitter, pattern], void 0,
          function(check){
            log('checkit', check[2][1] !== pattern)
            return check[2][1] !== pattern
          }
        )
      }
    }
  })
}

function walkRefs( target, emitter, pattern, originalTarget, event ) {
  var targetval = target._$val
  if( targetval instanceof Base ) {
    var firstRef = target
    var refHandler = createRH( emitter, pattern, originalTarget, event )
    target.on( '$reference', refHandler )
    target = targetval
    while( target._$val instanceof Base ) {
      target.on( '$reference', refHandler )
      target = target._$val
    }
    cacheRef( pattern, firstRef, target )
  }
  return target
}

function clean( target, oldRef ) {
  // console.log('clean target', target)
  throw new Error('clean is not yet implemented')
}

function createRH( emitter, pattern, originalTarget, event ) {
  return [ function refHandler( event, oldvalue, wex, wax ) {
    console.warn('********* subscription refListener!', oldvalue, wex, wax)

    clean( oldvalue )

    if( !(this._$val instanceof Base) ) { // no longer a reference
      // console.log( '>>> no longer a reference' )
      // remove refListener
      // this.$removeListener(referenceListener)
      // subscribe to self

    } else { // still a reference
      // console.log( '>>> still a reference' )

      // subscribe to new reffed stuff

    }
  }, emitter ]
}

function createMPH( target, pattern, emitter, originalTarget ) {
  return function missingPropHandler( event, meta ) {
    log.warn('********* missingPropHandler!')
    var added = meta.added
    if( added ) {
      // check if any added properties are relevant
      var addedProps = []
      var subsmeta
      var emit
      for( var a = 0, l = added.length; a <= l; a++ ) {
        var addkey = added[a]
        var firstChar = addkey[0]
        if( firstChar !== '_' && firstChar !== '$' ) {
          var patternPart = pattern[addkey]
          if( patternPart ) {
            // relevant property detected
            var targetProp = target[addkey]
            targetProp = walkRefs( targetProp, emitter, pattern,
              originalTarget, event
            )
            addedProps.push( targetProp )

            if( patternPart.$val === true ) {
              // added property is targeted by subscription
              // add change listener, update meta and ensure emission
              emit = true
              var passon = createPasson( emitter, originalTarget, patternPart )
              targetProp.on( '$change', passon )
              if( !subsmeta ) {
                subsmeta = emitter._$meta || (emitter._$meta = {})
              }
              addChangeToMeta( subsmeta, targetProp, originalTarget,
                patternPart
              )
            } else {
              // added property is intermediate step in pattern
              // continue subscribing downward
              subscribe( targetProp, emitter, event, patternPart,
                originalTarget
              )
            }

          }
        }

      }

      if( addedProps.length ) {
        // check if all properties are now present
        // remove this missingField listener if all fields are present
        var missing
        pattern.each(function( patternPart, key ) {
          if( !target[key] ) {
            return missing = true
          }
        })
        if( !missing ) {
          // target.off('$property', { $attach: missingPropHandler })
          target.off('$property', { $attach: { $check:
            function(check){
              return check[2][1] === pattern
            }}
          })
        }

        // check if emitting because of deeper subscribe
        // or because a "targeted" property was added
        if( emitter._$emitting || emit ) {
          // add added info to meta
          if( !subsmeta ) {
            subsmeta = emitter._$meta || (emitter._$meta = {})
          }
          addAddedToMeta( subsmeta, target, originalTarget, pattern,
            addedProps
          )
          // if a targetted field was added directly we emit here
          // otherwise the emit is already called while subscribing deeper
          if( emit ) {
            emitter.$emit( event, originalTarget )
          }
        }

      }
    }
  }
}

function createPH( target, emitter, pattern, originalTarget ){
  return function propertyHandler( event, meta ) {
    log.error('********* subscription property listener!', pattern)

    var added = meta.added
    if( added ) {
      var addedProps = []
      var subsmeta
      var emit
      for( var i = 0, l = added.length ; i < l ; i++ ) {
        var addkey = added[i]
        var firstChar = addkey[0]

        if( firstChar !== '_' && firstChar !== '$' ) {
          var targetProp = target[addkey]
          targetProp = walkRefs( targetProp, emitter, pattern,
            originalTarget, event
          )
          addedProps.push(targetProp)

          if( pattern.$val === true ) {
            // added property is targeted by subscription
            // add change listener, update meta and ensure emission
            emit = true
            var passon = createPasson( emitter, originalTarget, pattern )
            targetProp.on( '$change', passon )
            if( !subsmeta ) {
              subsmeta = emitter._$meta || (emitter._$meta = {})
            }
            addChangeToMeta( subsmeta, targetProp, originalTarget,
              pattern
            )
          } else {
            // added property is intermediate step in pattern
            // continue subscribing downward
            subscribe( targetProp, emitter, event, pattern, originalTarget )
          }
        }
      }

      // check if emitting because of deeper subscribe
      // or because a "targeted" property was added
      if( emitter._$emitting || emit ) {
        // add added info to meta
        if( !subsmeta ) {
          subsmeta = emitter._$meta || (emitter._$meta = {})
        }
        addAddedToMeta( subsmeta, target, originalTarget, pattern,
          addedProps
        )
        // if a targetted field was added directly we emit here
        // otherwise the emit is already called while subscribing deeper
        if( emit ) {
          emitter.$emit( event, originalTarget )
        }
      }

    }
  }
}

function createPasson( emitter, originalTarget, pattern ) {
  return [
    function(event, remove) {
      log.warn('********* subscription change listener!',
        this.$path, this.$val,'remove:', remove
      )
      // TODO: check here if still relevant? (higher remove already caught?)
      var subsmeta = emitter._$meta || (emitter._$meta = {})
      if(remove) {
        if(this === originalTarget) {
          emitter._$meta = null
        } else {
          var removePointer = addRemoveToMeta( subsmeta, this, originalTarget,
            pattern )
          var mphTarget = removePointer.$parent // << parent
          var missingPattern = pattern.$parent
          var mphHandler = createMPH(
            mphTarget, missingPattern, emitter, originalTarget
          )
          mphTarget.on(
            '$property', [mphHandler, emitter, missingPattern], void 0
            , function(check){
              return check[2][1] !== missingPattern
            }
          )
        }
      } else {
        addChangeToMeta( subsmeta, this, originalTarget, pattern )
      }
      emitter.$emit( event, originalTarget )
    },
    emitter
  ]
}

function cacheRef( pattern, ref, target ){
  // console.log('CACHE DAT REF', pattern, ref, target)
  var cache = pattern._refs || (pattern._refs = {})
  cache[target.$uid] = ref
}

function addChangeToMeta( meta, target, originalTarget, pattern ) {
  var path = getPath( target, originalTarget, pattern )
  setWithPath( meta, path, target )
}

function addRemoveToMeta( meta, target, originalTarget, pattern ) {
  log.header('addRemoveToMeta!')
  log(target.$parent, 'this._$parent')
  target = getRemovePointer(target, pattern)
  var path = getPath( target, originalTarget, pattern )
  setWithPath( meta, path, target )
  return target
}

function addAddedToMeta( meta, target, originalTarget, pattern, addedProps ) {
  var path = getPath( target, originalTarget, pattern )
  setWithPath( meta, path, { _added: addedProps }, function( has ) {
    var hasadded = has._added
    if( hasadded ) {
      hasadded.push.apply( hasadded, addedProps )
    } else {
      has._added = addedProps
    }
  })
}

function getPath( target, originalTarget, pattern, path ) {
  if(!path) {
    path = []
  }
  target = unWalkRefs( target, pattern )
  if( target !== originalTarget ) {
    path.unshift(target.$key)
    getPath(target.$parent, originalTarget, pattern.$parent, path)
  }
  return path
}

function getRemovePointer( target, pattern ) {
  while(target.$val === null) {
    target = unWalkRefs( target, pattern )
    if( target.$val === null ) {
      target = target.$parent //
    }
  }
  return target
}

function unWalkRefs( target, pattern ) {
  var refscache = pattern._refs
  var cached = refscache && refscache[target.$uid]
  if( cached ) {
    target = cached
  }
  return target
}

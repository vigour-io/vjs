"use strict";

var Base = require('../../base')
var setWithPath = require('../../util/setwithpath')
// module.exports = function subscribe( pattern, listeners, event ){
module.exports = function subscribe( target, emitter, pattern, originalTarget, event ) {

  if( !pattern  ) { // this means first call in the flow
    pattern = emitter.$pattern
    originalTarget = target
  }

  // console.log( '---------- > $SUPSCRIBS', target, pattern )

  // walk over references
  target = walkRefs( target, emitter, pattern, originalTarget, event )

  // if pattern is true, subscribe to this!
  if( pattern._$val === true ) {
    // console.log('!!!!!!!!!! add dat listeners!')
    var passon = createPasson( emitter, originalTarget, pattern )
    target.on( '$change', passon )
    return
  }

  pattern.each(function( sub, key ){

    // console.log('huppa subscribe to', key, 'with', sub.$val, 'in', target.$path)

    if( key === 'any$' ) { // any$
      // listen to changes on all properties
      if( sub.$val === true ) { // directly
        console.log( 'burf?' )

        target.each(function( targetProp ) {

          targetProp = walkRefs( targetProp, emitter, sub, originalTarget, event )

          // console.log('subscribe!', targetProp.$path)
          var passon = createPasson( emitter, originalTarget, sub )
          targetProp.on( '$change', passon )

          if( event ) {
            // cache info in emitter!
            emitter.$emit( event, originalTarget )
          }
        })
      } else { // nested
        target.each(function( targetProp ) {
          targetProp = walkRefs( targetProp, emitter, pattern, originalTarget, event )
          subscribe( targetProp, emitter, sub, originalTarget, event )
        })
      }

      // add property listener to add listeners inside new properties
      // console.log('adding property listener to', target )

      var propHandler = createPH( target, emitter, sub, originalTarget )

      target.on( '$property', [ propHandler, emitter ] )

      // console.log('done adding property listener')
    } else { // not any$ > specific key

      var targetProp = target[key]

      if( targetProp ) { // property is present
        // console.log('yes i have that key!', key)
        targetProp = walkRefs( targetProp, emitter, sub, originalTarget, event )

        if( sub.$val === true ) {
          // console.log('subscribing!', targetProp.$path)

          var passon = createPasson( emitter, originalTarget, sub )
          targetProp.on( '$change', passon )

          if( event ) {
            // console.log('and fire!')
            emitter.$emit( event, originalTarget )
          }

        } else {
          subscribe( targetProp, emitter, sub, originalTarget, event )
        }

      } else { // property is not present
        // console.log( 'i fear i do not have that key yet!', key,
        //  'better add a property listener for that!'
        // )

        // add property listener to add listeners inside new properties
        var missingPropHandler = createMPH( target, key, sub, emitter, originalTarget )

        target.on( '$property', [missingPropHandler, emitter] )
      }
    }
  })
}

// TODO: have a way to fire specific listeners for now use this:
function fireListeners( firer, listeners, event ){
  var emitters = firer.$on
  for( var type in listeners ) {
    emitters[type].$emit( event, firer )
    // listeners[type].call(firer, event)
  }
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

function createMPH( target, key, pattern, emitter, originalTarget ) {
  return function missingPropHandler( event, meta ) {
    // console.warn('********* subscription missing property listener!')
    var added = meta.added
    if(added && added.indexOf( key ) !== -1) {
      // console.log('===============!!!! missingPropHandler !!!!')

      var targetProp = target[key]

      var meta = emitter._$meta || (emitter._$meta = {})
      addAddedToMeta( meta, target, originalTarget, pattern, targetProp )

      if( pattern.$val === true ) {
        var passon = createPasson( emitter, originalTarget, pattern )
        targetProp.on( '$change', passon )
        emitter.$emit( event, originalTarget )
      } else {
        subscribe( targetProp, emitter, pattern, originalTarget, event )
      }

      // remove this missingField listener, if all fields are present
      var parentPattern = pattern._$parent
      var missing
      parentPattern.each(function( sub, key ) {
        if( !target[key] ) {
          return missing = true
        }
      })
      if( !missing ) {
        target.off('$property', { $attach: missingPropHandler })
      }

    }
  }
}

function createPH( target, emitter, pattern, originalTarget ){
  return function propertyHandler( event, meta ) {
    // console.warn('********* subscription property listener!')

    var added = meta.added
    if( added ) {
      var emit
      for( var i = 0, l = added.length ; i < l ; i++ ) {
        var addkey = added[i]
        var firstChar = addkey[0]

        if( firstChar !== '_' && firstChar !== '$' ) {
          var targetProp = target[addkey]
          if( pattern.$val === true ) {
            var passon = createPasson( emitter, originalTarget, pattern )
            targetProp.on( '$change', passon )
            emit = true
          } else {
            subscribe( targetProp, emitter, pattern, originalTarget, event )
          }
        }
      }

      if( emit ) {
        console.error('???? what is this mergeAddedList for ????')
        mergeAddedList( emitter, added )
        // mergeMeta( emitter, meta )
        emitter.$emit( event, originalTarget )
      }
    }
  }
}

function createPasson( emitter, originalTarget, pattern ) {
  return [
    function(event){
      // console.warn('********* subscription change listener!', this.$path)
      // TODO: check here if still relevant? (higher remove already caught?)
      var meta = emitter._$meta || (emitter._$meta = {})
      addChangeToMeta( meta, this, originalTarget, pattern )
      emitter.$emit( event, originalTarget )
    },
    emitter
  ]
}

function cacheRef( pattern, ref, target ){
  console.log('CACHE DAT REF', pattern, ref, target)
  var cache = pattern._refs || (pattern._refs = {})
  cache[target.$uid] = ref
}

function addChangeToMeta( meta, target, originalTarget, pattern ) {
  var path = getPath( target, originalTarget, pattern )
  setWithPath( meta, path, target )
}

function addAddedToMeta( meta, target, originalTarget, pattern, targetProp ) {
  var path = getPath( target, originalTarget, pattern )
  setWithPath( meta, path, { _added: [ targetProp ] }, function( has ) {
    if(has._added) {
      has._added.push( targetProp )
    } else {
      has._added = [ targetProp ]
    }
  })
}

function getPath( target, originalTarget, pattern, path ) {
  if(!path) {
    path = []
  }
  target = unWalkRefs(pattern, target)
  if( target !== originalTarget ) {
    path.unshift(target.$key)
    getPath(target.$parent, originalTarget, pattern.$parent, path)
  }
  return path
}

function unWalkRefs( pattern, target ) {
  var refscache = pattern._refs
  var cached = refscache && refscache[target.$uid]
  if( cached ) {
    target = cached
  }
  return target
}

"use strict";

var Base = require( '../../base' )
var Event = require( '../../event' )

// dev
var Observable = require('../../observable')
// dev

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


  // walk over references
  target = walkRefs( target, emitter, pattern, originalTarget, event )

  // if pattern is true, subscribe to this!
  if( pattern._$val === true ) {
    console.log('!!!!!!!!!! add dat listeners!')

    addTargetListener( target, emitter, pattern, originalTarget )

    // var passon = createPasson( emitter, originalTarget, pattern )
    // target.on( '$change', passon )

    if( event ) {
      var subsmeta = emitter._$meta || (emitter._$meta = {})
      console.log('16')
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
            targetProp, emitter, patternPart, originalTarget
          )

          // console.log('subscribe!', targetProp.$path)
          addTargetListener( targetProp, emitter, patternPart, originalTarget )


          if( event ) {
            var subsmeta = emitter._$meta || (emitter._$meta = {})
            console.log('111')
            addChangeToMeta( subsmeta, targetProp, originalTarget, patternPart )
            emitter.$emit( event, originalTarget )
          }
        })
      } else { // nested
        target.each(function( targetProp ) {
          targetProp = walkRefs( targetProp, emitter, pattern, originalTarget )
          subscribe( targetProp, emitter, event, patternPart, originalTarget )
        })
      }

      // add property listener to add listeners inside new properties
      // console.log('adding property listener to', target )
      addAnyListener( target, emitter, patternPart, originalTarget )

      // console.log('done adding property listener')
    } else { // not any$ > specific key

      var targetProp = target[key]

      if( targetProp ) { // property is present
        // console.log('yes i have that key!', key)
        targetProp = walkRefs( targetProp, emitter, patternPart,
          originalTarget
        )
        if( patternPart.$val === true ) {
          // console.log('yes this is targeted burp')
          addTargetListener( targetProp, emitter, patternPart, originalTarget )

          if( event ) {
            // console.log('and fire!')
            var subsmeta = emitter._$meta || (emitter._$meta = {})
            console.log('1', targetProp.$path)
            addChangeToMeta( subsmeta, targetProp, originalTarget, patternPart )
            emitter.$emit( event, originalTarget )
          }

        } else {
          subscribe( targetProp, emitter, event, patternPart, originalTarget )
        }
      } else if( !missingPropHandler ){
        // property is not present and havent added
        // missing property listener yet
        addMissingPropListener( target, emitter, pattern, originalTarget )
      }
    }
  })
}



// ============================== listeners

function createRefHandler( emitter, pattern, originalTarget ) {
  return function refHandler( event, oldvalue ) {
    console.error('********* subscription refListener!',
    '\n path:', this.$path,
      '\noldvalue\n', oldvalue
    )

    var target = this

    clean( oldvalue, pattern )

    var targetVal = target._$val
    if( !(targetVal instanceof Base) ) {
      console.log( '>>> no longer a reference, remove refListener!', target.$path )
      console.log('wex referencelistener', target.$on.$reference)
      // TODO: remove this listener by pattern
      target.off('$reference', { $attach: { $check:
        function( found ){
          console.log('????????', found, found[2][1] === pattern)
          console.log('WAT', found[2][1],
            '\nPATTERN?!', pattern
          )
          return found[2] && found[2][1] === pattern
        }}
      })
    } else {
      target = walkRefs( target, emitter, pattern, originalTarget )
    }

    subscribe( target, emitter, event, pattern, originalTarget )



  }
}

function clean( target, pattern ) {
  // console.log('clean target', target)
  log.error('---------- yay lets clean!', target.$path,
    '\npattern:', pattern,
    '\ntarget.$on.$change', target.$on.$change
  )

  target = cleanRefs( target, pattern )

  if(pattern.$val === true) {
    target.off('$change', { $attach: { $check:
      function( found ){
        return found[2] && found[2][1] === pattern
      }}
    })
  } else {
    log('nope not done yet!')
    pattern.each(function( patternPart, key ) {
      if( key === 'any$' ) {
        console.log('oh gosh remove anyListener from target and then',
          'clean all properties of target'
        )
      } else {
        console.log('see if target has property', key, '\n',
          'if not, remove missingPropListener (if not already done)\n',
          'if so, continue cleaning property', key
        )
      }
    })

  }
}

function cleanRefs( target, pattern ) {
  console.warn('cleanRefs!')
  var val = target._val
  while( val instanceof Base ) {
    target = val
    // clean
    val.off('$reference', { $attach: { $check: removeCheck } })
    val = val._val
  }
  return target

  function removeCheck( found ) {
    console.warn('check for removal!', found)
    return found[2] && found[2][1] === pattern
  }
}

function addTargetListener( target, emitter, pattern, originalTarget ) {
  var handler = createTargetHandler( emitter, pattern, originalTarget  )
  target.on( '$change', [ handler, emitter, pattern ] )
}

function createTargetHandler( emitter, pattern, originalTarget ) {
  return function targetHandler(event, remove) {
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

        addMissingPropListener( mphTarget, emitter, missingPattern,
          originalTarget
        )

      }
    } else {
      console.log('13')
      addChangeToMeta( subsmeta, this, originalTarget, pattern )
    }
    emitter.$emit( event, originalTarget )
  }
}

function addMissingPropListener( target, emitter, pattern, originalTarget ) {
  var handler = createMissingPropHandler( target, emitter, pattern,
    originalTarget
  )
  target.on( '$property', [ handler, emitter, pattern ], void 0,
    function( found ){
      return !found[2] || found[2][1] !== pattern
    }
  )
}

function createMissingPropHandler( target, emitter, pattern, originalTarget ) {
  return function missingPropHandler( event, meta ) {
    log.warn('********* missingPropHandler!')
    var added = meta.added
    if( added ) {
      // check if any added properties are relevant
      var addedProps = []
      var subsmeta
      var emit
      for( var a = 0, l = added.length -1; a <= l; a++ ) {
        var addkey = added[a]

        if(!addkey) {
          console.log('WEX added', added, added.length, a)
          debugger
        }
        var firstChar = addkey[0]


        if( firstChar !== '_' && firstChar !== '$' ) {
          var patternPart = pattern[addkey]
          if( patternPart ) {
            // relevant property detected
            var targetProp = target[addkey]
            targetProp = walkRefs( targetProp, emitter, pattern,
              originalTarget
            )
            addedProps.push( targetProp )

            if( patternPart.$val === true ) {
              // added property is targeted by subscription
              // add change listener, update meta and ensure emission
              emit = true
              addTargetListener( targetProp, emitter, patternPart,
                originalTarget
              )

              if( !subsmeta ) {
                subsmeta = emitter._$meta || (emitter._$meta = {})
              }
              console.log('14')
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
          target.off('$property', { $attach: { $check:
            function( found ){
              return found[2] && found[2][1] === pattern
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

function addAnyListener( target, emitter, pattern, originalTarget ) {
  var handler = createAnyHandler( emitter, pattern, originalTarget )
  target.on( '$property', [ handler, emitter, pattern ] )
}

function createAnyHandler( emitter, pattern, originalTarget ) {
  return function anyHandler( event, meta ) {
    var target = this

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
            originalTarget
          )
          addedProps.push(targetProp)

          if( pattern.$val === true ) {
            // added property is targeted by subscription
            // add change listener, update meta and ensure emission
            emit = true
            addTargetListener( targetProp, emitter, pattern, originalTarget )

            if( !subsmeta ) {
              subsmeta = emitter._$meta || (emitter._$meta = {})
            }
            console.log('15')
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



function addChangeToMeta( meta, target, originalTarget, pattern ) {
  // log.shine('hurk!', target.$path)
  console.error('?!?!', target, originalTarget, pattern)
  var path = getPath( target, originalTarget, pattern )
  setWithPath( meta, path, target )
}

function addRemoveToMeta( meta, target, originalTarget, pattern ) {
  // log.header('addRemoveToMeta!')
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

function walkRefs( target, emitter, pattern, originalTarget ) {
  var targetval = target._$val
  if( targetval instanceof Base ) {
    var firstRef = target
    var refHandler = createRefHandler( emitter, pattern, originalTarget )
    log.shine('add reference listenert')
    console.error('?!?!?')
    target.on( '$reference', [ refHandler, emitter, pattern ] )
    log('look at dem listeners!',
      'one!', target.$on.$reference.$attach[1],
      '\ntwo!', target.$on.$reference.$attach[2]
    )
    target = targetval
    while( target._$val instanceof Base ) {
      console.log('!!!!!!! ADD ANOTHER', target.$path)
      target.on( '$reference', [ refHandler, emitter, pattern ] )
      target = target._$val
    }
    cacheRef( pattern, firstRef, target )
  }
  return target
}

function cacheRef( pattern, ref, target ){
  // console.log('CACHE DAT REF', pattern, ref, target)
  var cache = pattern._refs || (pattern._refs = {})
  cache[target.$uid] = ref
}

function getPath( target, originalTarget, pattern, path ) {
  if(!path) {
    path = []
  }
  log.shine('unWalkRefs!')
  target = unWalkRefs( target, pattern )
  if( target !== originalTarget ) {
    path.unshift(target.$key)
    getPath(target.$parent, originalTarget, pattern.$parent, path)
  }
  return path
}

function getRemovePointer( target, pattern ) {
  while(target.$val === null) {
    log.shine('unWalkRefs removePointer!')
    target = unWalkRefs( target, pattern )
    if( target.$val === null ) {
      target = target.$parent //
    }
  }
  return target
}

function unWalkRefs( target, pattern ) {
  var refsCache = pattern._refs
  var cached = refsCache && refsCache[target.$uid]
  if( cached ) {
    target = cached
  }
  return target
}

function unWalkRef( target, pattern ) {
  var refsCache = pattern._refs
}

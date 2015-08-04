"use strict";

var Base = require('../../base')

// module.exports = function subscribe( pattern, listeners, event ){
module.exports = function subscribe( target, emitter, pattern,passon, originalTarget, event ) {

  if( !pattern  ) { // this means first call in the flow
    pattern = emitter.$pattern
    originalTarget = target
  }

  console.log( '---------- > $SUPSCRIBS', target, pattern )

  // walk over references
  target = walkRefs( target, emitter, pattern, passon, originalTarget, event )

  // if pattern is true, subscribe to this!
  if(pattern._$val === true) {
    console.log('!!!!!!!!!! add dat listeners!')
    if(!passon) {
      passon = createPasson(emitter, originalTarget)
    }
    target.on('$change', passon)
    return
  }

  pattern.each(function(sub, key){
      
    console.log('huppa subscribe to', key, 'with', sub.$val, 'in', target.$path)

    if(key === 'any$') { // any$ 
      // listen to changes on all properties
      if(sub.$val === true) { // directly
        console.log('burf?')

        target.each(function(targetProp) {

          targetProp = walkRefs(targetProp, emitter, pattern, passon, originalTarget, event)

          console.log('subscribe!', targetProp.$path)

          if(!passon) {
            passon = createPasson(emitter, originalTarget)
          }
          target.on('$change', passon)

          if(event) {
            // cache info in emitter!
            emitter.$emit(event, originalTarget)
          }
        })
      } else { // nested
        target.each(function(targetProp) {
          targetProp = walkRefs(targetProp, emitter, pattern, passon, originalTarget, event)
          subscribe(targetProp, emitter, pattern, passon, originalTarget, event)
        })
      }

      // add property listener to add listeners inside new properties
      console.log('adding property listener to', target )

      var propHandler = createPH( target, emitter, sub, passon, originalTarget )

      target.on('$property', [propHandler, emitter])

      console.log('done adding property listener')
    } else { // not any$ > specific key

      var targetProp = target[key]

      if(targetProp) { // property is present
        console.log('yes i have that key!', key)
        targetProp = walkRefs(targetProp, emitter, pattern, passon, originalTarget, event )

        if(sub.$val === true) {
          console.log('subscribing!', targetProp.$path)

          if(!passon) {
            passon = createPasson(emitter, originalTarget)
          }
          targetProp.on('$change', passon)
          if(event) {
            console.log('and fire!')
            emitter.$emit(event, originalTarget)
          }

        } else {
          subscribe(targetProp, emitter, sub, passon, originalTarget, event)
        }

      } else { // property is not present
        console.log( 'i fear i do not have that key yet!', key,
         'better add a property listener for that!' 
        )

        // add property listener to add listeners inside new properties
        var missingPropHandler = createMPH(target, key, sub, emitter, passon, originalTarget)
        target.on('$property', [missingPropHandler, emitter])
      }
    }
  })
}

// TODO: have a way to fire specific listeners for now use this:
function fireListeners(firer, listeners, event){
  var emitters = firer.$on
  for(var type in listeners) {
    emitters[type].$emit(event, firer)
    // listeners[type].call(firer, event)
  }
}

function walkRefs(target, emitter, pattern, passon, originalTarget, event) {

  var refHandler

  while( target._$val instanceof Base ) {
    if(!refHandler) {
      refHandler = createRH(emitter, pattern, passon, originalTarget, event)
    }

    console.error('hey reference! add referenceListener!', target.$path)

    target.on('$reference', [refHandler, emitter])

    // target.$set({
    //   $on:{
    //     $reference: referenceListener
    //   }
    // })
    target = target._$val
  }
  return target
}

function clean(target, oldRef) {
  console.log('clean target', target)
  throw new Error('clean is not yet implemented')
}

function createRH(emitter, pattern, passon, originalTarget, event) {
  return [function refHandler(event, oldvalue) {
    console.error('!!! reference listener !!!')
    clean(oldvalue)

    if(!(this._$val instanceof Base)) { // no longer a reference
      // remove refListener
      // this.$removeListener(referenceListener)

      // subscribe to self
      

    } else { // still a reference
      // subscribe to new reffed stuff
      
    }
  }, emitter]
}

function createMPH(target, key, sub, emitter, passon, originalTarget) {
  return function missingPropHandler(event, meta) {
    console.warn('********* subscription missing property listener!')
    var added = meta.added
    if(added && added.indexOf(key) !== -1) {
      console.log('===============!!!! missingPropHandler !!!!')

      var targetProp = target[key]
      if(sub.$val === true) {
        if(!passon) {
          passon = createPasson(emitter, originalTarget)
        }
        targetProp.on( '$change', passon )

        var meta = emitter._$meta
        if(!meta) {
          emitter._$meta = {
            added: added
          }
        } else if(!meta.added){
          meta.added = added
        } else {
          meta.added.push.apply( meta.added, added )
        }

        emitter.$emit(event, originalTarget)

      } else {
        subscribe(targetProp, emitter, sub, passon, originalTarget, event)
      }

      // TODO: remove this missingField listener, if all fields are present

    }
  }
}

function createPH( target, emitter, sub, passon, originalTarget ){
  return function propertyHandler(event, meta) {
    console.warn('********* subscription property listener!')
    
    var added = meta.added
    if(added) {
      for(var i = 0, l = added.length ; i < l ; i++) {
        var addkey = added[i]
        var firstChar = addkey[0]
        if(firstChar !== '_' && firstChar !== '$') {
          var targetProp = target[addkey]
          if(sub.$val === true) {
            console.log('subscribing', targetProp.$path)
            if(!passon) {
              passon = createPasson( emitter, originalTarget )
            }
            targetProp.on( '$change', passon )
            emitter.$emit( event, originalTarget )
            // addListeners(targetProp, listeners, sub)
            // fireListeners(targetProp, listeners, event)
          } else {
            subscribe(targetProp, emitter, sub, passon, originalTarget, event)
          } 
        }
      }
    }
  } 
}

function createPasson(emitter, originalTarget) {
  return [
    function(event){
      console.warn('********* subscription change listener!')
      var meta = emitter._$meta
      if(!meta) {
        emitter._$meta = {
          changes: [ this ]
        }
      } else if(!meta.changes){
        meta.changes = [ this ]
      } else {
        meta.changes.push(this)
      }
      emitter.$emit(event, originalTarget)
    }, 
    emitter 
  ]  
}

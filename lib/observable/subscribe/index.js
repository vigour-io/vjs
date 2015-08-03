"use strict";

var Base = require('../../base')

exports.$define = {
  $subscribe: function( subsObj, listeners, event ){
    var target = this

    target = walkRefs( target, subsObj, listeners, event )

    console.log('---------- > $SUPSCRIBS', subsObj)

    if(subsObj._$val === true) {
      console.log('!!!!!!!!!! add dat listeners!')
      addListeners(target, listeners, subsObj)
      return
    }

    subsObj.each(function(sub, key){
        
      console.log('huppa subscribe to', key, 'with', sub.$val, 'in', target.$path)

      if(key === 'any$') { // any$ 
        // listen to changes on all properties
      if(sub.$val === true) { // directly
          console.log('burf?')
          target.each(function(targetProp) {

            targetProp = walkRefs(targetProp, subsObj, listeners, event)
            console.log('subscribe!', targetProp.$path)

            addListeners(targetProp, listeners, sub)

            if(event) {
              console.log('also fire dems listeren')
              fireListeners(targetProp, listeners, event)
            }
          })
        } else { // nested
          target.each(function(targetProp) {
            targetProp = walkRefs(targetProp, subsObj, listeners, event)
            targetProp.$subscribe(sub, listeners, event)
          })
        }

        // add property listener to add listeners inside new properties
        console.log('adding property listener to', target )

        var propHandler = createPH(target, sub, listeners)
        target.on('$property', [propHandler, sub], function subsCompare(compare){
          return compare[1] !== sub
        })

        console.log('done adding property listener')
      } else { // not any$ > specific key

        var targetProp = target[key]

        if(targetProp) { // property is present
          console.log('yes i have that key!', key)
          targetProp = walkRefs(targetProp, subsObj, listeners, event)

          if(sub.$val === true) {
            console.log('subscribing!', targetProp.$path)
            addListeners(targetProp, listeners, sub)
            if(event) {
              console.log('also fire dems listeren')
              fireListeners(targetProp, listeners, event)
            }

          } else {
            targetProp.$subscribe(sub, listeners, event)
          }

        } else { // property is not present
          console.log( 'i fear i do not have that key yet!', key,
           'better add a property listener for that!' 
          )

          // add property listener to add listeners inside new properties
          var missingPropHandler = createMPH(target, key, sub, listeners)
          target.on('$property', [missingPropHandler, subsObj], false,
            function subsCompare(compare){
              return compare[1] !== subsObj
            }
          )
        }
      }
    })
  }
}

// TODO: have a way to fire specific listeners for now use this:
function fireListeners(firer, listeners, event){
  var emitters = firer.$on
  for(var type in listeners) {
    emitters[type].$emit(event, firer)
    // listeners[type].call(firer, event)
  }
}

function walkRefs(target, subsObj, listeners, event) {

  var refHandler

  while( target._$val instanceof Base ) {
    if(!refHandler) {
      refHandler = createRH(listeners, subsObj)
    }

    console.error('hey reference! add referenceListener!', target.$path)

    target.on('$reference', [refHandler, subsObj], false,
      function subsCompare(compare){
        return compare[1] !== subsObj
      }
    )

    // target.set({
    //   $on:{
    //     $reference: referenceListener
    //   }
    // })
    target = target._$val
  }
  return target
}

function clean(target, oldRef) {

}

function createRH(listeners, subsObj) {
  return function refHandler(event, oldvalue) {
    console.error('!!! reference listener !!!')
    clean(oldvalue)
    var target
    if(!(this._$val instanceof Base)) { // no longer a reference
      // remove refListener
      // this.$off(referenceListener)

      // subscribe to self
      

    } else { // still a reference
      // subscribe to new reffed stuff
      
    }
  }
}

function createMPH(target, key, sub, listeners) {
  return function missingPropHandler(event, meta) {
    var added = meta.added
    if(added && added.indexOf(key) !== -1) {

      var targetProp = target[key]

      if(sub.$val === true) {
        addListeners(targetProp, listeners, sub)
        console.log('also fire dems listeren')
        fireListeners(targetProp, listeners, event)
      } else {
        targetProp.$subscribe(sub, listeners, event)
      }

      // TODO: remove this missingField listener, if all fields are present

    }
  }
}

function addListeners(target, listeners, subsObj) {
  for(var type in listeners) {
    console.log('ADD SUBSCRIPTION LISTENERS', target.$path)
    target.on(type, [listeners[type], subsObj], false, 
      function subsCompare( compare ) {
        return compare[1] !== subsObj
      }
    )
  }
}

function createPH(target, sub, listeners){
 return function propertyHandler(event, meta) {
    console.error('subscribe property listener fires!', event, meta)
    var added = meta.added
    if(added) {
      for(var i = 0, l = added.length ; i < l ; i++) {
        var addkey = added[i]
        var firstChar = addkey[0]
        if(firstChar !== '_' && firstChar !== '$') {
          var targetProp = target[addkey]
          if(sub.$val === true) {
            console.log('subscribing', targetProp.$path)
            addListeners(targetProp, listeners, sub)
            fireListeners(targetProp, listeners, event)
          } else {
            targetProp.$subscribe(sub, listeners, event)
          } 
        }
      }
    }
  } 
}
'use strict'
/*
**** WARNING ****
* cannot use double inheritance paths
* var Thing = new Elem({ text: })
* var Page = new Elem({ gurk: { thing: new Thing }})
* when you start making instances of page.gurk -- gurk will be used as top level -- if this become a problem we have to think of something
* can be much unified with element and subs i supose -- its just storing common ancestor paths exactly what we want for subs
* how to do how to do
* prob just storing them
* has to be greedy and smarter in doing things
*
* **** WARNING 2 ****
* for condition when using defered events context will be pretty much lost (dont want to store on defaut event)
* the condition event will handle this itself
*
* **** WARNING 3 ****
* context does not get restored -- dont want to store context chains
*/
module.exports = function emitContext (parent, bind, event, data, emitter, context, prevpath) {
  let parentInstances
  let path
  // console.log('lets emit context!', bind.path)
  // if (!emitter) {
  //   return
  // }
  // context =
  while (parent) { // !parent._context FIX THIS!
    parentInstances = parent.getInstances()
    // console.log('yo parent!', parent.path, parentInstances)
    // if context && instance of perhaps?
    if (parentInstances) {
      // console.log('......yo!', parent.path)
      let pathlength
      for (let i = 0, length = parentInstances.length; i < length; i++) {
        let instance = parentInstances[i]
        let target = instance
        // console.log('tryin to find!', instance._path, context._path)
        // var pass
        // if (instance && instance.hasOwnProperty('_Constructor') && (context instanceof instance.Constructor)) {
        //   // instance = context
        //   // context = instance
        //   // pass = true
        // }
        if (
          !context ||
          instance === context
        ) {
          if (path) {
            if (!pathlength) {
              pathlength = path.length - 1
            }
            for (let j = pathlength; j >= 0; j--) {
              target = target[path[j]]
              if (!target) {
                break
              }
            }
          }

          if (target && target[bind.key] === bind) {
            // if (bind._context && bind._lc !== bind._context.uid) {
              if (!emitter) {
                throw new Error('no emitter! emit context' + bind._path.join('.'))
              }
              // you knew what to do here -- o yeah it the zig zag context + level walker -- happy joy
              // handle better for multi context is slow now!
              // so this i sobviously not enough -- we need to do zig zag context level what abotu only udating the end points
              // no cant
              emitContext(instance, bind, event, data, emitter, false, path)
              // makes everything heavier test this
              // bind._lc = bind._context.uid // this needs to go better
              emitter.execInternal(bind, event, data)
            }
          // }
          if (context) {
            // return
          }
        }
      }
      // ********* NEEDS PERF OPTIMIZATION ************
      // really heavy think of a solution later for now lets celebrate that it works!
      // becomes espacialy problematic with many parents
      // return
    }
    if (!path) {
      path = prevpath ? prevpath.concat() : []
    }
    path.push(parent.key) // reuse!!! godamn must be easy
    parent = parent._parent
  }
}
